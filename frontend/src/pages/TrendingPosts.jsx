import { Flame } from 'lucide-react';
import { getPosts } from '../api/postApi';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom';


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
                    sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
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

const TrendingPosts = () => {

    const navigate = useNavigate();
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
            <div className="flex flex-col gap-2">

                <div className="flex flex-row items-center gap-2">
                    <h1 className="font-semibold">Trending Posts</h1>
                    <Flame className="text-orange-300 fill-red-700" size={24} />
                </div>


                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center gap-4">
                        <select onChange={(e) => dispatch({ type: "SET_SORT_BY", payload: e.target.value })} className="p-2 rounded hover:cursor-pointer border border-gray-300 focus:border-[#424068]" name="sortBy" id="sortBy">
                            <option value="dateCreated">Date Created</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="likesCount">Likes</option>
                        </select>
                    </div>
                </div>



                <div className="flex flex-col gap-1 w-full h-[600px] overflow-y-scroll">
                    {state.posts.map((item) => {
                        return (
                            <Link className="col-span-5 row-span-2 rounded-lg h-[200px] shadow-lg border border-gray-200" onClick={() => { navigate(`/readpost/${item._id}`) }} to={`/readpost/${item._id}`}>
                                <div className="flex flex-col p-4 gap-2">
                                    <span className="text-lg font-semibold">{item.title}</span>
                                    <div className="flex flex-row items-center gap-1">
                                        <span className="text-xs">by</span>
                                        <span className="text-xs font-medium">{item.author}</span>

                                    </div>
                                    <div className="bg-white rounded-lg  truncate text-ellipsis h-full">
                                        <span className="text-sm">{item.description}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 p-4">
                                    {item.tags.map((tag) => {
                                        return (
                                            <span className="text-xs bg-gray-200 rounded-lg p-2 capitalize">{tag}</span>
                                        )
                                    })}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <ToastContainer />
            </div>

        )

    }


}

export default TrendingPosts;