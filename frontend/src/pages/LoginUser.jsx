import { Link } from "react-router-dom";
import { loginUser } from "../api/loginApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useReducer, useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/userContext";
import { ArrowLeft } from 'lucide-react';

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
    const [step, setStep] = useState(1); // Step state to manage view
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setStep(2); // Move to the password step
    }

    const handleVerifyUser = async (e) => {
        e.preventDefault();

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
            toast.error('Error logging in!', { position: "top-right" });
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <form onSubmit={step === 1 ? handleEmailSubmit : handleVerifyUser}>
                    <div className="h-[250px] flex flex-col gap-4 p-4 rounded-lg bg-white border-solid border-2 border-[#eeeff4]">
                        <div className="flex flex-col gap-3">
                            {step == 1 && (
                                <h3 className="text-xl font-semibold transition duration-300 ease-in-out">Sign in</h3>
                            )}
                            
                            {step === 1 && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold ">Email address</span>
                                        <input onChange={(e => dispatch({ type: 'SET_EMAIL', payload: e.target.value }))} className="rounded-lg p-1 border border-gray-200 text-sm font-light" type="email" name="email" id="email" required />
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <button className="text-xs rounded-lg w-full text-white bg-[#424068] p-2" type="submit">Continue</button>
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>  
                                    <div>
                                        <ArrowLeft size={20} className="cursor-pointer" onClick={() => setStep(1)} />
                                    </div>
                                    <div className="flex flex-col gap-1 mt-5">
                                        <span className="text-xs font-semibold ">Password</span>
                                        <input onChange={(e => dispatch({ type: 'SET_PASSWORD', payload: e.target.value }))} className="rounded-lg p-1 border border-gray-200 text-sm font-light" type="password" name="password" id="password" required />
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <button className="text-xs rounded-lg w-full text-white bg-[#424068] p-2" type="submit" disabled={state.isSubmitFormBtnDisabled}>Sign In</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-row gap-2 items-baseline">
                            <span className="text-xs">Don't have an account?</span>
                            <Link to="/join"><button className="text-xs font-semibold text-[#424068] hover:underline ">Sign Up</button></Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default LoginUser;
