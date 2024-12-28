const express = require('express');
const database = require('../connect');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

let postRoutes = express.Router();

// 1. Retrieve all posts
// http://localhost:3000/posts


postRoutes.route("/posts").get( verifyToken, async (request, response) => {
    try {
        let db = database.getDataBase();
        let data = await db.collection("posts").find({}).toArray();

        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).json({ error: "No posts found." });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving posts", details: error.message });
    }
});

// 2. Retrieve a single post by ID
postRoutes.route("/posts/:id").get(verifyToken, async (request, response) => {
    try {
        let db = database.getDataBase();
        
        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let data = await db.collection("posts").findOne({ _id: new ObjectId(request.params.id) });

        if (data) {
            response.status(200).json(data);
        } else {
            response.status(404).json({ error: "Post not found." });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving the post", details: error.message });
    }
});

// 3. Create a new post
postRoutes.route("/posts").post(verifyToken,async (request, response) => {
    try {
        let db = database.getDataBase();
        let postObject = {
            title: request.body.title,
            description: request.body.description,
            author: request.body.author,
            dateCreated: new Date(),
            likeCount: 0
        };
        let result = await db.collection("posts").insertOne(postObject);
        response.status(201).json(result);
    } catch (error) {
        response.status(500).json({ error: "An error occurred while creating the post", details: error.message });
    }
});

// 4. Update a post
postRoutes.route("/posts/:id").put(verifyToken, async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("posts").updateOne(
            { _id: new ObjectId(request.params.id) },
            { $set: request.body }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({ error: "Post not found" });
        }

        response.status(200).json({ success: true, data: result });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while updating the post", details: error.message });
    }
});

// 5. Delete a post
postRoutes.route("/posts/:id").delete(verifyToken ,async (request, response) => {
    try {
        let db = database.getDataBase();
        
        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("posts").deleteOne({ _id: new ObjectId(request.params.id) });

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: "Post not found" });
        }

        response.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while deleting the post", details: error.message });
    }
});



function verifyToken(request, response, next) {
    const authHeaders  = request.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];
    if (token) {
        //verify token
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return response.status(403).json({ error: "Invalid token" });
            }
            request.body.user = user;
            next();
        });
    } else {
        return response.status(401).json({ error: "No token provided" });
    }

}



module.exports = postRoutes
