import { getAllPostsByUser } from "../api/postApi";
import { List, Grid3x3 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useReducer } from "react";
import PostContainer from "../components/PostContainer";

const Account = () => {


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
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 p-2">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-extrabold">Your Posts</h2>

                        <div className="flex flex-row items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Grid3x3 className="hover-sky-600-text" width={20} onClick={() => dispatch({ type: 'SET_POST_VIEW', payload: 'grid' })} />
                            |
                            <List className="hover-sky-600-text" width={20} onClick={() => dispatch({ type: 'SET_POST_VIEW', payload: 'list' })} />
                        </div>

                    </div>
                    {state.loading && <p>Loading...</p>}
                    {state.postView === 'list' && (
                        <div className="flex flex-col gap-1 w-full">
                        {state.posts.map((post) => (
                            <PostContainer key={post._id} post={post} index={state.posts.indexOf(post)} viewType={state.postView} />
                        ))}

                    </div>
                    )}
                    {state.postView === 'grid' && (
                        <div className="grid grid-cols-3 gap-2">
                        {state.posts.map((post) => (
                            <PostContainer key={post._id} post={post} index={state.posts.indexOf(post)} viewType={state.postView} />
                        ))}

                    </div>
                    )}
                    
                    
                </div>
            </div>
            <ToastContainer />
        </>
        );
}

export default Account