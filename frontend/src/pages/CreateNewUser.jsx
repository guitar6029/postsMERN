import { EyeClosed, Eye, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/userContext";
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { createUser } from '../api/userApi';
import { ToastContainer, toast } from 'react-toastify';

const CreateNewUser = () => {
    const navigate = useNavigate();
    const { setUserProperties } = useUserContext();

    const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isSubmitFormBtnDisabled: false,
        passwordIsHidden: true
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_FIRST_NAME':
                return { ...state, firstName: action.payload };
            case 'SET_LAST_NAME':
                return { ...state, lastName: action.payload };
            case 'SET_EMAIL':
                return { ...state, email: action.payload };
            case 'SET_PASSWORD':
                return { ...state, password: action.payload };
            case 'SET_CONFIRM_PASSWORD':
                return { ...state, confirmPassword: action.payload };
            case 'SET_IS_SUBMIT_FORM_BTN_DISABLED':
                return { ...state, isSubmitFormBtnDisabled: action.payload };
            case 'RESET_FORM':
                return initialState;
            case 'SET_PASSWORD_IS_HIDDEN':
                return { ...state, passwordIsHidden: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const [step, setStep] = useState(1); // Step state to manage view

    useEffect(() => {
        dispatch({ type: 'RESET_FORM' });
    }, []);

    const handleToggleShowPassword = () => {
        dispatch({ type: 'SET_PASSWORD_IS_HIDDEN', payload: !state.passwordIsHidden });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setStep(2); // Move to the next step
    }

    const handleCreateNewUser = async (event) => {
        event.preventDefault();

        dispatch({ type: 'SET_IS_SUBMIT_FORM_BTN_DISABLED', payload: true });

        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const userObject = {
                firstName: state.firstName,
                lastName: state.lastName,
                email: state.email,
                password: state.password,
                dateCreated: new Date(),
                likeCount: 0,
                savedPosts: [],
                posts: []
            };

            let response = await createUser(userObject, signal);
            if (response && response.status === 201) {
                const { token, user } = response.data;

                sessionStorage.setItem('token', token);
                setUserProperties(user);
                axios.defaults.headers.common["Authorization"] = "Bearer " + token;

                dispatch({ type: 'RESET_FORM' });
                navigate('/home');
            } else {
                toast.error(response?.data?.error ? response.data.error : 'Error creating user!', { position: "top-right" });
                dispatch({ type: 'SET_IS_SUBMIT_FORM_BTN_DISABLED', payload: false });
            }

        } catch (error) {
            console.error('Error creating user:::', error);
            dispatch({ type: 'SET_IS_SUBMIT_FORM_BTN_DISABLED', payload: false });
            toast.error('Error creating user!', { position: "top-right" });
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <form onSubmit={step === 1 ? handleEmailSubmit : handleCreateNewUser}>
                    <div className="h-[350px] flex flex-col gap-4 p-4 rounded-lg bg-white border-solid border-2 border-[#eeeff4]">
                        <div className="flex flex-col gap-3">
                            {step === 1 && (
                                <>
                                    <h3 className="text-xl font-semibold transition duration-300 ease-in-out">Create New User</h3>
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
                                        <span className="text-xs font-semibold ">First Name</span>
                                        <input
                                            onChange={(e) => dispatch({ type: 'SET_FIRST_NAME', payload: e.target.value })}
                                            required
                                            className="rounded-lg p-1 border border-gray-200 text-sm font-light"
                                            value={state.firstName}
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            maxLength={40}
                                            minLength={3}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold ">Last Name</span>
                                        <input
                                            onChange={(e) => dispatch({ type: 'SET_LAST_NAME', payload: e.target.value })}
                                            required
                                            className="rounded-lg p-1 border border-gray-200 text-sm font-light"
                                            value={state.lastName}
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            maxLength={40}
                                            minLength={3}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold ">Password</span>
                                        <div className="flex flex-row gap-2 items-baseline">
                                            <input
                                                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                                                required
                                                className="rounded-lg p-1 border border-gray-200 text-sm font-light"
                                                value={state.password}
                                                type={state.passwordIsHidden ? "password" : "text"}
                                                name="password"
                                                id="password"
                                                placeholder='Enter your password...'
                                                maxLength={40}
                                            />
                                            {state.passwordIsHidden &&
                                                <button type="button" onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-1 bg-[#424068] rounded-lg text-white  ">
                                                    <EyeClosed size={10} />
                                                </button>
                                            }
                                            {!state.passwordIsHidden &&
                                                <button type="button" onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-1  bg-[#424068] rounded-lg text-white ">
                                                    <Eye size={10} />
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold ">Confirm Password</span>
                                        <div className="flex flex-row gap-2 items-center">
                                            <input
                                                onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
                                                required
                                                className="rounded-lg p-1 border border-gray-200 text-sm font-light"
                                                value={state.confirmPassword}
                                                type={state.passwordIsHidden ? "password" : "text"}
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                maxLength={40}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-1 mt-4">
                                        <button
                                            type="submit"
                                            disabled={state.isSubmitFormBtnDisabled || (!state.email || !state.firstName || !state.lastName || !state.password || !state.confirmPassword || (state.password && state.confirmPassword && state.password !== state.confirmPassword))}
                                            className="text-xs rounded-lg w-full text-white bg-[#424068] p-2 disabled:opacity-50"
                                        >
                                            Sign Up

                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-row gap-2 items-baseline  self-center">
                            <span className="text-xs">Already have an account?</span>
                            <Link to="/"><button className="text-xs font-semibold text-[#424068] hover:underline ">Login</button></Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default CreateNewUser;
