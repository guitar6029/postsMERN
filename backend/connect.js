
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const uri = process.env.ATLAS_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let dataBase;

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect(); // Establish connection
            dataBase = client.db("blogData"); // Set the database instance
            console.log("Connected to MongoDB Atlas 🚀");
        } catch (error) {
            console.error("Error connecting to MongoDB Atlas:", error.message);
            throw error; // Rethrow the error for better error handling
        }
    },
    getDataBase: () => {
        if (!dataBase) {
            throw new Error("Database not initialized. Call connectToServer() first.");
        }
        return dataBase;
    }
};