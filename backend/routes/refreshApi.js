const jwt = require('jsonwebtoken');
const db = require('../connect');
const express = require('express');

let refreshRoutes = express.Router();

/**
 * when the user refreshes the webpage, this gets called
 */
refreshRoutes.route("/refresh").post(async (request, response) => {
    const token = request.body.token;
    if (!token) { 
        return response.status(401).json({ message: 'Token is required' }); 
    } 

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => { 
        if (error) { 
            return response.status(403).json({ message: 'Invalid token' }); 
        } 
        // Fetch user information from the database 
        const db = database.getDataBase(); 
        const user = await db.collection('users').findOne({ _id: decoded.id }); 
        if (!user) { 
            return response.status(404).json({ message: 'User not found' }); 
        } 
        // Send back user information without the password 
        const userWithoutSensitiveData = { firstName: user.firstName, lastName: user.lastName }; 
        response.json({ user: userWithoutSensitiveData }); });

})

module.exports = refreshRoutes