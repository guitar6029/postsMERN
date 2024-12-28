import axios from 'axios'
const URI = "http://localhost:3000"

/**
 * get all posts
 * @param {} signal 
 * @returns 
 */
export async function getPosts(signal) {
    try {
        const response = await axios.get(`${URI}/posts`, { signal })
      
        if (response.status === 200) {
            return response.data

        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}

/**
 * get specific post
 * @param {*} id 
 * @param {*} signal 
 */
export async function getPost(id, signal) {
    try {
        const response = await axios.get(`http://localhost:3000/posts/${id}`, { signal })
      
        if (response.status === 200) {
           return response.data

        }
    } catch (error) {
        console.error("Error fetching data:", error)

    }
}






/**
 * create a post
 * required 
 * {
 *    title : string,
 *    description : string,
 *    author : string,
 *    dateCreated: Date
 * }
 * @param {*} postOject 
 * @param {*} signal 
 */
export async function createPost(postOject, signal) {
    const postObject = {
        title: postOject.title,
        description: postOject.description,
        author: postOject.author,
        dateCreated: new Date(),
        likeCount: postOject.likeCount
    }
    try {
        const response = await axios.post(`${URI}/posts`, postObject, { signal })
        return response
        
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}



/**
 * update post
 * @param {*} id 
 * @param {*} data 
 * @param {*} signal 
 */
export async function updatePost(id, data, signal) {
    try {
        const response = await axios.post(`http://localhost:3000/posts/${id}`, data, { signal })
        
    } catch (error) {
        console.error("Error fetching data:", error)
       
    }
}


/**
 * Delete post
 * @param {} id 
 * @param {*} signal 
 */
export async function deletePost(id, signal) {
    try {
        let response = await axios.delete(`${URI}/posts/${id}`, { signal })
        return response;
        

    } catch (error) {
        console.error("Error fetching data:", error)
        
    }
}

