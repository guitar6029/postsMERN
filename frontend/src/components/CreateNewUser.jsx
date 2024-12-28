import { createUser } from '../api/userApi';
import { StickyNote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';

import { HandMetal } from 'lucide-react';
import { EyeClosed } from 'lucide-react';
import { Eye } from 'lucide-react';

import { Link } from 'react-router-dom';

const CreateNewUser = () => {


    //navigate to home after user created
    const navigate = useNavigate();


    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [isSubmitFormBtnDisabled, setSubmitFormBtnDisabled] = useState(false);
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);


    const handleToggleShowPassword = () => {
        setPasswordIsHidden(!passwordIsHidden);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleCreateNewUser = async (event) => {
        event.preventDefault();

        setSubmitFormBtnDisabled(true);

        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const userObject = {
                username: user.username,
                email: user.email,
                password: user.password,
                dateCreated: new Date(),
                likeCount: 0,
                savedPosts: [],
                posts: []
            };

            let response = await createUser(userObject, signal);

            if (response && response.status === 201) {

                //clear the form
                setUser({ username: "", email: "", password: "" });

                //redirect to home page
                navigate('/home');
            }

        } catch (error) {


            if (axios.isCancel(error)) {
                toast.error('Error creating user!', { position: "top-right" });
                console.log("Request canceled:", error.message);
                setSubmitFormBtnDisabled(false);
            } else {
                toast.error('Error creating user!', { position: "top-right" });
                console.error("Error creating user:", error);
                setSubmitFormBtnDisabled(false);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleCreateNewUser} >
                <div className="flex flex-col gap-4 w-full p-4 bg-slate-100 rounded-lg ">
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-2xl font-bold">Create New User</span>
                        <StickyNote />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">Username</h3>
                        <input
                            onChange={handleInputChange}
                            required
                            className="rounded-lg p-2"
                            value={user.username}
                            type="text"
                            name="username"
                            id="username"
                            placeholder='Enter your username...'
                            maxLength={40}
                            minLength={3}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2">
                            <h3 className="font-semibold">Email</h3>
                        </div>
                        <input
                            onChange={handleInputChange}
                            required
                            className="rounded-lg p-2"
                            value={user.email}
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
                                onChange={handleInputChange}
                                required
                                className="rounded-lg p-2"
                                value={user.password}
                                type={passwordIsHidden ? "password" : "text"}
                                name="password"
                                id="password"
                                placeholder='Enter your password...'
                                maxLength={40}
                            />
                            {passwordIsHidden &&
                                <button onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white "><EyeClosed /></button>
                            }
                            {!passwordIsHidden &&
                                <button onClick={handleToggleShowPassword} className="hover:cursor-pointer flex flex-row gap-2 items-center mt-2 p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white "><Eye /></button>
                            }

                        </div>
                    </div>
                    <div >
                        <button
                            type="submit"
                            disabled={!isSubmitFormBtnDisabled && (!user.email || !user.username || !user.password)}
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
