import axios from 'axios'
const URI = "http://localhost:3000"

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

export async function createPost(postOject, signal) {

    //get token to verify
    const token = sessionStorage.getItem('token');

    const postObject = {
        title: postOject.title,
        author: postOject.author,
        description: postOject.description,
        dateCreated: new Date(),
        likeCount: postOject.likeCount
    }
    try {
        const response = await axios.post(`${URI}/posts`, postObject, { signal, headers: { Authorization: `Bearer ${token}` } })
        return response

    } catch (error) {
        console.error("Error fetching data:", error)
    }
}

export async function updatePost(id, data, signal) {
    try {
        const response = await axios.post(`http://localhost:3000/posts/${id}`, data, { signal })

    } catch (error) {
        console.error("Error fetching data:", error)

    }
}


export async function deletePost(id, signal) {
    try {
        let response = await axios.delete(`${URI}/posts/${id}`, { signal })
        return response;


    } catch (error) {
        console.error("Error fetching data:", error)

    }
}

/**
 * the request to get all posts by the user
 * backend will handle retriveing the id from the token
 * @param {*} signal 
 */
export async function getAllPostsByUser(signal) {
    try {
        const response = await axios.get(`${URI}/posts/user/all`, { signal })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}


// checks if user can delete the post by checking the user id and the post creator id
export async function userAllowedToDeletePost(id, signal) {
    try{
        const response = await axios.get(`${URI}/posts/delete-one/${id}`, { signal })
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}


//get most recent posts, limit to argument maxPosts
export async function getRecentPosts(maxPosts = 5, signal) {
    try {
        const response = await axios.get(`${URI}/posts/recent/${maxPosts}`, { signal })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}
