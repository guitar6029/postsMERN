import axios from 'axios';

const verifyToken = async (token) => {
    try {
        const response = await axios.get('/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.userId;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

// Use this function before creating a post
const createPost = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        // Handle no token scenario
        return;
    }

    const userId = await verifyToken(token);
    if (userId) {
        // Proceed with post creation
    } else {
        // Handle invalid token scenario
    }
};
