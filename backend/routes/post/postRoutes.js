const express = require('express');
const database = require('../../connect');
const ObjectId = require('mongodb').ObjectId;
const authMiddleware = require('../../middleware/auth/authMiddleware');
const attachUserIdMiddleware = require('../../middleware/auth/attachUserIdMiddleware');
const dynamicUserPropertiesMiddleware = require('../../middleware/dynamicUserPropertiesMiddlware');
require('dotenv').config({ path: './config.env' });



// Use middleware to get user properties dynamically 
const userPropertiesMiddleware = dynamicUserPropertiesMiddleware(['firstName', 'lastName']);


let postRoutes = express.Router();

// 1. Retrieve all posts
postRoutes.route("/posts").get(authMiddleware, async (request, response) => {
    try {
        const db = await database.getDataBase();
        const data = await db.collection("posts").find({}).toArray();

        // Return the data, even if the array is empty
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving posts", details: error.message });
    }
});


// 2. Retrieve a single post by ID
postRoutes.route("/posts/:id").get(authMiddleware, async (request, response) => {
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
postRoutes.route("/posts").post(authMiddleware, userPropertiesMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        let db = database.getDataBase();
        let postObject = {
            author: `${request.firstName} ${request.lastName}`,

            title: request.body.title,
            description: request.body.description,
            creatorsID: request.userId,
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
postRoutes.route("/posts/:id").put(authMiddleware, async (request, response) => {
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
postRoutes.route("/posts/:id").delete(authMiddleware, async (request, response) => {
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


// Get all posts by user ID (_id)
postRoutes.route("/posts/user/all").get(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        const db = await database.getDataBase();
        const userId = request.userId; // Use the attached user ID from middleware

        if (!userId) {
            return response.status(401).json({ error: "User ID not found in token" });
        }

        // Retrieve posts by userId
        const data = await db.collection("posts").find({ creatorsID: userId.toString() }).toArray();

        // Respond with the data, even if it's an empty array
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving posts", details: error.message });
    }
});


//delete all post by user id (_id)
postRoutes.route("/posts/user/delete-all").delete(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        const db = database.getDataBase();
        const userId = request.userId; // Use the attached user ID from the middleware
        if (!userId) {
            return response.error(401).json({ error: "User ID not found in token" });
        }

        const result = await db.collection("posts").deleteMany({ creatorsID: userId.toString() });

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: "Post not found" });
        }

        response.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while deleting the post", details: error.message });
    }
})


// returns if user is allowed to delete a particular post depending if post
// was originally created by the user or not
postRoutes.route("/posts/delete-one/:id").get(authMiddleware, attachUserIdMiddleware, async (request, response) => {
    try {
        const postIdForDelete = request.params.id;
        const db = database.getDataBase();
        // Use the attached user ID from the middleware
        const userId = request.userId;


        if (!userId) {
            return response.status(401).json({ error: "User ID not found in token" });
        }

        const post = await db.collection("posts").findOne(
            {
                creatorsID: userId.toString(),
                _id: new ObjectId(postIdForDelete)
            }
        );

        if (post) {
            response.status(200).json({ success: true, message: "Post can be deleted" });
        } else {
            response.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while deleting the post", details: error.message });
    }
});



module.exports = postRoutes;
