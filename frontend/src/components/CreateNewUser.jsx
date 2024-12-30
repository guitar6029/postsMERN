import { HandMetal, EyeClosed, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/userContext";
import { useEffect, useReducer } from 'react';
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

    useEffect(() => {
        // Reset form state when component mounts
        dispatch({ type: 'RESET_FORM' });
    }, []);

    const handleToggleShowPassword = () => {
        dispatch({ type: 'SET_PASSWORD_IS_HIDDEN', payload: !state.passwordIsHidden });
    };

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

                // Store token in session storage
                sessionStorage.setItem('token', token);
                setUserProperties(user);

                // Set Axios authorization header
                axios.defaults.headers.common["Authorization"] = "Bearer " + token;

                // Clear the form
                dispatch({ type: 'RESET_FORM' });

                // Redirect to home page
                navigate('/home');
            }

        } catch (error) {
            if (axios.isCancel(error)) {
                toast.error('Error creating user!', { position: "top-right" });
                dispatch({ type: 'SET_IS_SUBMIT_FORM_BTN_DISABLED', payload: false });
            } else {
                toast.error('Error creating user!', { position: "top-right" });
                dispatch({ type: 'SET_IS_SUBMIT_FORM_BTN_DISABLED', payload: false });
            }
        }
    };

    return (
        <>
            <form onSubmit={handleCreateNewUser}>
                <div className="flex flex-col gap-4 w-full p-4 bg-slate-100 rounded-lg">
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-2xl font-bold">Create New User</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">First Name</h3>
                        <input
                            onChange={(e) => dispatch({ type: 'SET_FIRST_NAME', payload: e.target.value })}
                            required
                            className="rounded-lg p-2"
                            value={state.firstName}
                            type="text"
                            name="firstName"
                            id="firstName"
                            maxLength={40}
                            minLength={3}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">Last Name</h3>
                        <input
                            onChange={(e) => dispatch({ type: 'SET_LAST_NAME', payload: e.target.value })}
                            required
                            className="rounded-lg p-2"
                            value={state.lastName}
                            type="text"
                            name="lastName"
                            id="lastName"
                            maxLength={40}
                            minLength={3}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2">
                            <h3 className="font-semibold">Email</h3>
                        </div>
                        <input
                            onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                            required
                            className="rounded-lg p-2"
                            value={state.email}
                            type="email"
                            name="email"
                            id="email"
                            placeholder='Enter your email...'
                            maxLength={40}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">Password</h3>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                                required
                                className="rounded-lg p-2"
                                value={state.password}
                                type={state.passwordIsHidden ? "password" : "text"}
                                name="password"
                                id="password"
                                placeholder='Enter your password...'
                                maxLength={40}
                            />
                            {state.passwordIsHidden &&
                                <button type="button" onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white ">
                                    <EyeClosed />
                                </button>
                            }
                            {!state.passwordIsHidden &&
                                <button type="button" onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white ">
                                    <Eye />
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">Confirm Password</h3>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
                                required
                                className="rounded-lg p-2"
                                value={state.confirmPassword}
                                type={state.passwordIsHidden ? "password" : "text"}
                                name="confirmPassword"
                                id="confirmPassword"
                                maxLength={40}
                            />
                        </div>
                    </div>
                    <div >
                        <button
                            type="submit"
                            disabled={state.isSubmitFormBtnDisabled || (!state.email || !state.firstName || !state.lastName || !state.password || (state.password && state.confirmPassword && state.password !== state.confirmPassword))}
                            className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50"
                        >
                            Join
                            <HandMetal />
                        </button>
                    </div>

                    <hr className="h-2 border-b-2 border-l-blue-600 " />
                    <div className="flex flex-row gap-2">
                        <span>Already have an account?</span>
                        <Link to="/">Login</Link>
                    </div>
                </div>
            </form>

            <ToastContainer />
        </>
    );
};

export default CreateNewUser;
