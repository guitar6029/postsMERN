import { Flame } from 'lucide-react';
import { getGreeting } from '../utils/StringUtils';
import { getPosts } from '../api/postApi';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useReducer } from 'react'
import { useUserContext } from '../context/userContext';
import PostContainer from '../components/PostContainer';


const initialState = {
    sortBy: 'title',
    posts: [],
    loadingPosts: true
}


const reducer = (state, action) => {
    let sortedPosts;

    switch (action.type) {
        case "SET_POSTS_LOADING":
            return { ...state, loadingPosts: action.payload };
        case "SET_SORT_BY":
            sortedPosts = [...state.posts]; // Create a copy to sort

            switch (action.payload) {
                case 'dateCreated':
                    sortedPosts.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
                    break;
                case 'title':
                    sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'author':
                    sortedPosts.sort((a, b) => a.author.localeCompare(b.author));
                    break;
                case 'likesCount':
                    sortedPosts.sort((a, b) => a.likeCount - b.likeCount);
                    break;
                default:
                    break;
            }
            return { ...state, posts: sortedPosts, sortBy: action.payload }; // Update sortedPosts and sortBy

        case "SET_POSTS":
            return { ...state, posts: action.payload };

        default:
            return state;
    }
};


const Home = () => {

    const { user } = useUserContext()
    const [state, dispatch] = useReducer(reducer, initialState)


    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal
        async function getDataPosts() {

            try {
                const response = await getPosts(signal)
                if (response && response.length > 0) {
                    dispatch({ type: "SET_POSTS_LOADING", payload: false });
                    dispatch({ type: "SET_POSTS", payload: response });
                } else if (response && response.length === 0) {
                    dispatch({ type: "SET_POSTS_LOADING", payload: false });
                    dispatch({ type: "SET_POSTS", payload: [] });
                }

            } catch (error) {
                dispatch({ type: "SET_POSTS_LOADING", payload: false })
                dispatch({ type: "SET_POSTS", payload: [] })
                toast.error('Error fetching data!', {
                    position: "top-right",
                })
            }
        }

        getDataPosts()
        return () => {
            controller.abort()
        }

    }, [])
    if (state.loadingPosts) {
        return (
            <div className="flex flex-row items-center">
                <h1>Loading...</h1>
            </div>
        )
    }

    if (state.loadingPosts === false && state.posts && state.posts.length > 0) {

        return (

            <div className="flex flex-col w-full gap-4 justify-center">
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl text-[#000] font-bold">{getGreeting()} {user?.firstName}</h1>
                    <div className="flex flex-row items-center gap-4">
                        <div>
                            <select onChange={(e) => dispatch({ type: "SET_SORT_BY", payload: e.target.value })} className="p-2 rounded hover:cursor-pointer" name="sortBy" id="sortBy">
                                <option value="dateCreated">Date Created</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="likesCount">Likes</option>
                            </select>
                        </div>
                    </div>
                </div>


                {/* add a highlight blog story , large post with image
                
                    samae large post here ,  recent lbogs here small one here
                    same large post here , small one here
                    same large post here , small one here
                    
                */}

                <div className="flex flex-row items-center gap-2">
                    <h1 className="font-semibold">Trending Posts</h1>
                    <Flame className="text-orange-300 fill-red-700" size={24} />
                </div>

                <div className="flex flex-col gap-1 w-full">

                    {state.posts.map((post, index) => {

                        return (
                            <PostContainer key={index} post={post} index={index} />
                        )
                    })}
                    <div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )

    } 
    
    if (state.loadingPosts === false && state.posts && state.posts.length === 0) {
        return (
            <>
                <div className="flex flex-col w-full text-center gap-4 justify-center items-center">
                    <div>
                        <h1>Hello {user?.firstName}</h1>
                        <h1 className="text-3xl mb-2">No Posts</h1>
                        <button className="rounded-lg p-2 w-fit bg-[#516DBE] text-[#000]">Create Post</button>
                    </div>
                </div>
                <ToastContainer />
            </>
        )
    }
}

export default Home;