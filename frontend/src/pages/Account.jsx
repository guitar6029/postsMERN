import { getAllPostsByUser } from "../api/postApi";
import { toast } from 'react-toastify';
import { useEffect, useReducer } from "react";
import { useUserContext } from "../context/userContext";

const Account = () => {
    const { user } = useUserContext();
    const initialState = {
        postsLoading: true,
        posts: [],
        postView: 'list'
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_POSTS':
                return { ...state, posts: action.payload }
            case 'SET_POSTS_LOADING':
                return { ...state, postsLoading: action.payload }
            case 'SET_POST_VIEW':
                return { ...state, postView: action.payload }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal


        async function getAllPosts() {
            try {
                const response = await getAllPostsByUser(signal)
                if (response) {
                    dispatch({ type: 'SET_POSTS', payload: response })
                    dispatch({ type: 'SET_POSTS_LOADING', payload: false })
                }
            } catch (error) {
                dispactch({ type: 'SET_POSTS_LOADING', payload: false })
                toast.error('Error fetching data!', { position: "top-right" })

            }
        }

        getAllPosts();

        return () => {
            controller.abort()
        }

    }, [])



    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-extrabold">
                        Account
                    </h2>
                    <div className="flex flex-col  gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <span>Full Name :</span>
                            <span>{user.firstName}</span>
                            <span>{user.lastName}</span>

                        </div>

                        <span>{user.email}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-extrabold">
                        Change Subscription
                    </h2>
                </div>

                <div className="flex flex-row gap-2">
                    <h2 className="text-2xl font-extrabold">Change Avatar</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-extrabold">
                        Delete Account
                    </h2>
                    <div className="flex flex-row gap-2">
                        <button className="p-2 text-white bg-red-600 rounded-lg">Delete</button>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Account