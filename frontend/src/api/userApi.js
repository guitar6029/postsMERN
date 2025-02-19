import axios from 'axios'
const URI = "http://localhost:3000"

/**
 * get specific user
 * @param {*} id 
 * @param {*} signal 
 */
export async function getUser(id, signal) {
    try {
        const response = await axios.get(`http://localhost:3000/users/${id}`, { signal })

        if (response.status === 200) {
            return response.data

        }
    } catch (error) {
        console.error("Error fetching data:", error)

    }
}



export async function createUser(userOject, signal) {
    const userObject = {

        firstName: userOject.firstName,
        lastName: userOject.lastName,
        email: userOject.email,
        password: userOject.password,
        dateCreated: new Date(),
        post: [],
        savedPosts: []
    }
    try {
        const response = await axios.post(`${URI}/users`, userObject, { signal })
        return response

    } catch (error) {
        console.error("Error fetching data:", error)
    }
}



/**
 * update user
 * @param {*} id 
 * @param {*} data 
 * @param {*} signal 
 */
export async function updateUser(id, data, signal) {
    try {
        const response = await axios.post(`http://localhost:3000/users/${id}`, data, { signal })

    } catch (error) {
        console.error("Error fetching data:", error)
    }
}
