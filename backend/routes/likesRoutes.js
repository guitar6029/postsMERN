const express = require('express');
const database = require('../connect');
const ObjectId = require('mongodb').ObjectId;

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

// 2. Update like count for a post
likesRoutes.route("/posts/:id/likes").post(async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        const likeChange = request.body.likeChange;

        // Ensure likeChange is a number
        if (typeof likeChange !== 'number') {
            return response.status(400).json({ error: "likeChange must be a number" });
        }

        let result = await db.collection("posts").updateOne(
            { _id: new ObjectId(request.params.id) },
            { $inc: { likeCount: likeChange } }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({ error: "Post not found" });
        }

        // Retrieve the updated like count
        let updatedPost = await db.collection("posts").findOne(
            { _id: new ObjectId(request.params.id) },
            { projection: { likeCount: 1 } }
        );

        response.status(200).json({ success: true, likeCount: updatedPost.likeCount });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while updating likes", details: error.message });
    }
});


module.exports = likesRoutes;
