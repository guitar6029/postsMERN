import { Link } from "react-router-dom";
import { loginUser } from "../api/loginApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const LoginUser = () => {


    const [isSubmitFormBtnDisabled, setSubmitFormBtnDisabled] = useState(false);
    const [user, setUser] = useState({ email: "", password: "" });


    const navigate = useNavigate();

    const handleVerifyUser = async (e) => {
        e.preventDefault()

        const controller = new AbortController();
        const signal = controller.signal;
        setSubmitFormBtnDisabled(true);
        try {
            const userObject = {
                email: user.email,
                password: user.password
            }

            let response = await loginUser(userObject, signal);

            if (response) {
                toast.success('Login successful!', { position: "top-right", });
                sessionStorage.setItem('User', response);
                axios.defaults.headers.common["Authorization"] = "Bearer " + response; 
                navigate('/home'); // Redirect to home page
            } else {
                setSubmitFormBtnDisabled(false);
                toast.error('Login failed!', { position: "top-right", });
            }

        } catch (error) {
            setSubmitFormBtnDisabled(false);
            if (axios.isCancel(error)) {
                toast.error('Error logging in!', {
                    position: "top-right",
                });
                console.log("Request canceled:", error.message);
            } else {
                toast.error('Error logging in!', {
                    position: "top-right",
                });
                console.error("Error logging in:", error);
            }
        }

    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }


    return (
        <>

            <form onSubmit={handleVerifyUser}>

                <div className="flex flex-col justify-center items-center gap-2 p-2 rounded-lg bg-[#d1d1e6]">
                    <h3 className="text-white text-2xl font-extrabold hover:text-[#CD6A65] transition duration-300 ease-in-out">Login</h3>
                    <div className="flex flex-row items-center w-full max-w-md">
                        <div className="w-1/4">
                            <span>Email</span>
                        </div>
                        <div className="w-3/4">
                            <input onChange={(e => handleInputChange(e))} className="rounded-lg p-2 w-full" type="email" name="email" id="email" />
                        </div>
                    </div>

                    <div className="flex flex-row items-center w-full max-w-md">
                        <div className="w-1/4">
                            <span>Password</span>
                        </div>
                        <div className="w-3/4">
                            <input onChange={(e => handleInputChange(e))} className="rounded-lg p-2 w-full" type="password" name="password" id="password" />
                        </div>
                    </div>

                    <div className="flex-flew-row gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitFormBtnDisabled || !user.email || !user.password}
                            className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2
                             bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50"
                        >Login </button>
                    </div>

                    <hr />
                    <div className="flex flex-row gap-2 items-center">
                        <span>Don&apos;t have an account?</span>
                        <Link to="/join"><button className="text-sm text-slate-600 hover:underline">Create New User</button></Link>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>

    )
}

export default LoginUser;