const express = require('express');
const database = require('../../connect');
const ObjectId = require('mongodb').ObjectId;
const authMiddleware = require('../../middleware/auth/authMiddleware');

require('dotenv').config({ path: './config.env' });

let recentRoutes = express.Router();

// Get recent posts
recentRoutes.route("/recent/posts/:maxPosts").get(authMiddleware, async (request, response) => {
    try {
        
        // Retrieve and parse maxPosts from the query string
        const maxPosts = parseInt(request.params.maxPosts) || 5;
        const db = await database.getDataBase();
        const recentPosts = await db
            .collection("posts")
            .find({})
            .sort({ createdAt: -1 })
            .limit(maxPosts)
            .toArray();

        // Always return a 200 status, even if no posts are found
        response.status(200).json(recentPosts);
    } catch (error) {
        response.status(500).json({
            error: "An error occurred while retrieving posts",
            details: error.message,
        });
    }
});


module.exports = recentRoutes;