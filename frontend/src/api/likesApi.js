
import axios from 'axios'

const URI = "http://localhost:3000"

/**
 * 
 * @param {*} id 
 * @param {*} signal 
 * @returns 
 */
export async function getLikesForPost(id, signal) {
    try {
        const response = await axios.get(`${URI}/posts/${id}/likes`, { signal })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) { 
        console.error("Error fetching data:", error)
    }

}
/**
 * 
 * @param {*} id 
 * @param {*} data 
 * @param {*} signal 
 * @returns 
 */
export async function updateLikeForPost(id, likeValue, signal) {
    try {
        const response = await axios.post(`${URI}/posts/${id}/likes`, likeValue, { signal })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}