// imports
const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const posts = require("./routes/postRoutes");
const likesRoutes = require('./routes/likesRoutes');
const userRoutes = require('./routes/userRoutes')
const refreshRoutes = require('./routes/refreshApi')



const app = express();
const PORT = process.env.PORT || 3000;

// General middlewares
app.use(cors());
app.use(express.json());

// Specific routes
app.use(posts);
app.use(likesRoutes);
app.use(userRoutes);
app.use(refreshRoutes)

// Start server
const startServer = async () => {
    try {
        await connect.connectToServer();  // Await the connection to the database
        console.log("Connected to MongoDB Atlas 🚀");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀🚀🚀`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit process with failure code
    }
};

startServer();
