const express = require('express');
const database = require('../connect');
const ObjectId = require('mongodb').ObjectId;
const authMiddleware = require('../middleware/auth/authMiddleware');
const attachUserIdMiddleware = require('../middleware/auth/attachUserIdMiddleware');

let likesRoutes = express.Router();

// 1. Retrieve likes for a post
likesRoutes.route("/posts/:id/likes").get(async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let data = await db.collection("posts").findOne(
            { _id: new ObjectId(request.params.id) },
            { projection: { likeCount: 1 } } // Only return likeCount
        );

        if (data) {
            response.status(200).json({ likeCount: data.likeCount });
        } else {
            response.status(404).json({ error: "Post not found." });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving likes", details: error.message });
    }
});

// 2. Update likes for a post
likesRoutes.route("/posts/:id/likes").post(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        let db = database.getDataBase();
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({ error: "User ID not found in token" });
        }

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        // Find the post
        const post = await db.collection("posts").findOne({ _id: new ObjectId(request.params.id) });

        if (!post) {
            return response.status(404).json({ error: "Post not found" });
        }

        const { likedByID } = post;
        const likeChange = request.body.likeChange;

        // Ensure likeChange is a number
        if (typeof likeChange !== 'number') {
            return response.status(400).json({ error: "likeChange must be a number" });
        }

        if (likeChange === 1) {
            // User is liking the post
            if (likedByID.includes(userId)) {
                return response.status(400).json({ error: "User has already liked the post" });
            }
            await db.collection("posts").updateOne(
                { _id: new ObjectId(request.params.id) },
                {
                    $inc: { likeCount: 1 },
                    $push: { likedByID: userId }
                }
            );
        } else if (likeChange === -1) {
            // User is unliking the post
            if (!likedByID.includes(userId)) {
                return response.status(400).json({ error: "User has not liked the post" });
            }
            await db.collection("posts").updateOne(
                { _id: new ObjectId(request.params.id) },
                {
                    $inc: { likeCount: -1 },
                    $pull: { likedByID: userId }
                }
            );
        } else {
            return response.status(400).json({ error: "Invalid like operation" });
        }

        // Retrieve the updated like count and likedById array
        let updatedPost = await db.collection("posts").findOne(
            { _id: new ObjectId(request.params.id) },
            { projection: { likeCount: 1, likedByID: 1 } }
        );

        response.status(200).json({ success: true, likeCount: updatedPost.likeCount, likedById: updatedPost.likedById });

    } catch (error) {
        response.status(500).json({ error: "An error occurred while updating likes", details: error.message });
    }
});

module.exports = likesRoutes;
