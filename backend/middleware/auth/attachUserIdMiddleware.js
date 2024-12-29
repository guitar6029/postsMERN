const attachUserIdMiddleware = (req, res, next) => {
    if (req.decodedToken && req.decodedToken.userId) {
        req.userId = req.decodedToken.userId; // Attach user ID to request object
    } else {
        return res.status(401).json({ error: "User ID not found in token" });
    }
    next();
};

module.exports = attachUserIdMiddleware;
