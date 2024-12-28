import axios from 'axios'
const URI = "http://localhost:3000"


export async function refreshTokenApi(token, signal) {
    try {
        const response = await fetch(`${URI}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
            signal
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}
