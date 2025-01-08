const express = require('express');
const database = require('../../connect');
const ObjectId = require('mongodb').ObjectId;
const authMiddleware = require('../../middleware/auth/authMiddleware');
const attachUserIdMiddleware = require('../../middleware/auth/attachUserIdMiddleware');
require('dotenv').config({ path: './config.env' });

let bookmarkedRoutes = express.Router();

//save the selected post ( post id) to the user's savedPosts array
bookmarkedRoutes.route("/bookmarks/add/:id").post(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        let db = database.getDataBase();

        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({ error: "User ID not found in token" });
        }

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        //check if posts exists
        const postExists = await db.collection("posts").findOne({ _id: new ObjectId(request.params.id) });
        if (!postExists) {
            return response.status(404).json({ error: "Post not found" });
        }

        let result = await db.collection("users").updateOne(
            { _id: new ObjectId(request.userId) },
            {
                $addToSet: {
                    savedPosts: new ObjectId(request.params.id)
                }
            }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        response.status(200).json({ success: true, message: "Post saved to bookmarks" });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while saving the post to bookmarks", details: error.message });
    }
});



bookmarkedRoutes.route("/bookmarks/remove/:id").delete(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        let db = database.getDataBase();
        console.log("called to remvoe bookmark");
        const userId = new ObjectId(request.userId);  // Ensure userId is an ObjectId
        if (!userId) {
            console.log('user id not found');
            return response.status(401).json({ error: "User ID not found in token" });
        }

        if (!ObjectId.isValid(request.params.id)) {
            console.log('invalid id');
            return response.status(400).json({ error: "Invalid ID format" });
        }

        const postId = new ObjectId(request.params.id);  // Convert postId to ObjectId
        console.log("my id : ", userId);
        console.log("post id to remove: ", postId);

        let result = await db.collection("users").updateOne(
            { _id: userId },  // Match userId as ObjectId
            {
                $pull: {
                    savedPosts: postId  // Match savedPosts as ObjectId
                }
            }
        );
        console.log('result', result);

        if (result.matchedCount === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        response.status(200).json({ success: true, message: "Post removed from bookmarks" });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while removing the post from bookmarks", details: error.message });
    }
});




module.exports = bookmarkedRoutes;