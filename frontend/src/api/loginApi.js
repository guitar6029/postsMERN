import axios from 'axios'
const URI = "http://localhost:3000"

export async function loginUser(userObj, signal) {
    try {
        let userObject = {
            email: userObj.email,
            password: userObj.password
        }

        let response = await axios.post(`${URI}/users/login`, userObject, { signal })
        if (response.status === 200) {
            return { token: response.data.token,  user: response.data.user}
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message)
        } else {
            console.error("Error fetching data:", error)
        }
    }
}
