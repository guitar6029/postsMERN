const { verifyToken } = require('../../utils/jwtUtils');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeaders = req.headers["authorization"];
        const token = authHeaders && authHeaders.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = await verifyToken(token);
        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
