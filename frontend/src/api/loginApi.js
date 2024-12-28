import axios from 'axios'
const URI = "http://localhost:3000"

export async function loginUser(userObj, signal) {
    try {
        let userObject = {
            email: userObj.email,
            password: userObj.password
        }

        let response = await axios.post(`${URI}/users/login`, userObject, { signal })
        console.log("response:::", response)
        if (response.status === 200) {
            return response.data.token
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message)
        } else {
            console.error("Error fetching data:", error)
        }
    }
}
