const express = require('express');
const database = require('../connect');
const e = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config({ path: './config.env' });


let favoritePostsRotes = express.Router();

//save post to favorite posts list
favoritePostsRotes.route("/posts/:id").post(verifyToken, async (request, response) => {
    
})




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




module.exports = favoritePostsRotes