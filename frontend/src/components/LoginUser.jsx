import { Link } from "react-router-dom";
import { loginUser } from "../api/loginApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useReducer } from "react";
import axios from "axios";
import { useUserContext } from "../context/userContext";


const LoginUser = () => {


    const { setUserProperties } = useUserContext();

    const initialState = {
        isSubmitFormBtnDisabled: false,
        email: "",
        password: ""
    }


    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_SUBMIT_FORM_BTN_DISABLED':
                return { ...state, isSubmitFormBtnDisabled: action.payload };
            case 'SET_EMAIL':
                return { ...state, email: action.payload };
            case 'SET_PASSWORD':
                return { ...state, password: action.payload };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();

    const handleVerifyUser = async (e) => {
        e.preventDefault()

        const controller = new AbortController();
        const signal = controller.signal;

        dispatch({ type: 'SET_SUBMIT_FORM_BTN_DISABLED', payload: true });
        try {
            const userObject = {
                email: state.email,
                password: state.password
            }

            const { token, user: loggedInUser } = await loginUser(userObject, signal);
            if (token) {
                sessionStorage.setItem('token', token);
                setUserProperties(loggedInUser);
                axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                // Redirect to home page 
                navigate('/home');
            } else {
                dispatch({ type: 'SET_SUBMIT_FORM_BTN_DISABLED', payload: false });
                toast.error('Login failed!', { position: "top-right" });
            }

        } catch (error) {

            dispatch({ type: 'SET_SUBMIT_FORM_BTN_DISABLED', payload: false });
            if (axios.isCancel(error)) {
                toast.error('Error logging in!', {
                    position: "top-right",
                });

            } else {
                toast.error('Error logging in!', {
                    position: "top-right",
                });
            }
        }

    }
    return (
        <>
            <div className="flex items-center justify-center min-h-screen">

                <form onSubmit={handleVerifyUser}>

                    <div className="flex flex-col justify-center items-center gap-2 p-4 rounded-lg bg-white border-solid border-2 border-black">
                        <h3 className="text-2xl font-extrabold text-[#CD6A65] transition duration-300 ease-in-out">Login</h3>
                        <div className="flex flex-row items-center w-full max-w-md">
                            <div className="w-1/4">
                                <span>Email</span>
                            </div>
                            <div className="w-3/4">
                                <input onChange={(e => dispatch({ type: 'SET_EMAIL', payload: e.target.value }))} className="rounded-lg p-2 w-full" type="email" name="email" id="email" />
                            </div>
                        </div>

                        <div className="flex flex-row items-center w-full max-w-md">
                            <div className="w-1/4">
                                <span>Password</span>
                            </div>
                            <div className="w-3/4">
                                <input onChange={(e => dispatch({ type: 'SET_PASSWORD', payload: e.target.value }))} className="rounded-lg p-2 w-full" type="password" name="password" id="password" />
                            </div>
                        </div>

                        <div className="flex-flew-row gap-2">
                            <button
                                type="submit"
                                disabled={state.isSubmitFormBtnDisabled || !state.email || !state.password}
                                className="bg-[#CD6A65] rounded-lg hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2
                              transition duration-300 ease-in-out text-white disabled:opacity-50"
                            >Login </button>
                        </div>

                        <hr />
                        <div className="flex flex-row gap-2 items-center">
                            <span>Don&apos;t have an account?</span>
                            <Link to="/join"><button className="text-sm text-slate-600 hover:underline">Create New User</button></Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>

    )
}

export default LoginUser;