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
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message)
        } else {
            console.error("Error fetching data:", error)
        }

    }
}


/**
 * create a user
 * required 
 * {
 *    title : string,
 *    description : string,
 *    author : string,
 *    dateCreated: Date
 * }
 * @param {*} userOject 
 * @param {*} signal 
 */
export async function createUser(userOject, signal) {
    const userObject = {
        username: userOject.username,
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
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message)
        } else {
            console.error("Error fetching data:", error)
        }
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
        if (axios.isCancel(error)) {
            console.error("Request canceled:", error.message)
        } else {
            console.error("Error fetching data:", error)
        }
        toast.error('Error fetching data!', {
            position: "top-right",
        })
    }
}
