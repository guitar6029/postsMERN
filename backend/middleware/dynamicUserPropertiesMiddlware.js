const database = require('../connect');
const { ObjectId } = require('mongodb');

const dynamicUserPropertiesMiddleware = (properties) => {
    return async (req, res, next) => {
        try {
            if (!req.decodedToken || !req.decodedToken.userId) {
            
                return res.status(401).json({ error: "User ID not found in token" });
            }

            // Extract user ID
            const userId = req.decodedToken.userId;
        
            // Fetch user from the database
            const db = database.getDataBase();
            const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

            if (!user) {
         
                return res.status(404).json({ error: "User not found" });
            }

            // Attach desired properties to the request object
            properties.forEach(property => {
                if (user.hasOwnProperty(property)) {
                    req[property] = user[property];
                }
            });

    
            next();
        } catch (error) {
            console.error("Error in dynamicUserPropertiesMiddleware:", error);
            return res.status(500).json({ error: "Failed to retrieve user properties" });
        }
    };
};

module.exports = dynamicUserPropertiesMiddleware;
