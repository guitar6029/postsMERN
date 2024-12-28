const express = require('express');
const database = require('../connect');
const e = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config({ path: './config.env' });

let userRoutes = express.Router();
const SALT_ROUNDS = 10

// 1. Retrieve all users
// http://localhost:3000/users
userRoutes.route("/users").get(async (request, response) => {
    try {
        let db = database.getDataBase();
        let data = await db.collection("users").find({}).toArray();

        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).json({ error: "No users found." });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving users", details: error.message });
    }
});

// 2. Retrieve a single user by ID
userRoutes.route("/users/:id").get(async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });

        if (data) {
            response.status(200).json(data);
        } else {
            response.status(404).json({ error: "Post not found." });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while retrieving the post", details: error.message });
    }
});

// 3. Create a new user
userRoutes.route("/users").post(async (request, response) => {
    try {



        let db = database.getDataBase();

        let userObject = {
            email: request.body.email,
        }
        //check if user already exists , use email as unique identifier
        let existingUser = await db.collection("users").findOne({ email: userObject.email });
        if (existingUser) {
            return response.status(400).json({ error: "User already exists" });
        } else {

            const hash = await bcrypt.hashSync(request.body.password, SALT_ROUNDS);

            let userObject = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                password: hash,
                dateCreated: new Date(),
                posts: []
                , savedPosts: []
            };
            // if user does not exist, create new user   
            let result = await db.collection("users").insertOne(userObject);
            const createdUser = results.ops[0]
            // Exclude password from the user object 
            const { password, ...userWithoutPassword } = createdUser; 
            return response.status(201).json({ success: true, user: userWithoutPassword });
        }
    } catch (error) {
        response.status(500).json({ error: "An error occurred while creating the post", details: error.message });
    }
});

// 4. Update a user
userRoutes.route("/users/:id").put(async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("users").updateOne(
            { _id: new ObjectId(request.params.id) },
            {
                $set: {
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    email: request.body.email,
                    password: request.body.password,
                    dateCreated: request.body.dateCreated,
                    savedPosts: request.body.savedPosts,
                    posts: request.body.posts
                }
            }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        response.status(200).json({ success: true, data: result });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while updating the user", details: error.message });
    }
});

// 5. Delete user
userRoutes.route("/users/:id").delete(async (request, response) => {
    try {
        let db = database.getDataBase();

        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) });

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: "Post not found" });
        }

        response.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while deleting the post", details: error.message });
    }
});


// 6. login user
userRoutes.route("/users/login").post(async (request, response) => {
    try {
        let db = database.getDataBase();

        let userObject = {
            email: request.body.email,
            password: request.body.password
        }
        //check if email exists
        let existingUser = await db.collection("users").findOne({ email: userObject.email });
        if (existingUser) {
            //now check if password is correct
            if (await bcrypt.compare(userObject.password, existingUser.password)) {
                //jwt token
                let token = jwt.sign(existingUser, process.env.JWT_SECRET, { expiresIn: '1h' })
                const { password, ...userWithoutPassword} = existingUser;
                return response.json({ success: true, token, user: userWithoutPassword });
            } else {
                return response.status(400).json({ error: "Credentials do not match" });
            }
        } else {
            return response.status(400).json({ error: "User does not exist" });
        }
    } catch (error) {

    }


})






module.exports = userRoutes
