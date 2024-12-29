import { useEffect, useState,  useReducer } from "react";
import { getAllPostsByUser } from "../api/postApi";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';

const Account = () => {


    const initialState = {
        postsLoading: true,
        posts: [],
    }


    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_POSTS':
                return { ...state, posts: action.payload }
            case 'SET_POSTS_LOADING':
                return { ...state, postsLoading: action.payload }
            default:
                return state
        }
    }

    const [ state, dispatch] = useReducer(reducer, initialState)


    const [userPosts, setUserPosts] = useState([]);

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
        <div className="flex flex-col gap-2">
            <div className="flex flex-col p-2">
                <h2>Your Posts</h2>
                {state.loading && <p>Loading...</p>}
                {state.posts.map((post) => (
                    <div key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <p>{post.dateCreated}</p>
                    </div>
                ))}
            </div>
        </div>
    </>);
}

export default Account