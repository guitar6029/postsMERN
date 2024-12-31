import { getGreeting } from '../utils/StringUtils';
import { getRecentPosts } from '../api/postApi';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useReducer } from 'react'
import { useUserContext } from '../context/userContext';
import { getColor } from '../utils/Colors';
import { Link, useNavigate } from "react-router-dom";
import { BookOpenText } from 'lucide-react';

const initialState = {
    recentPosts: [],
    loadingRecentPoasts: true
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_RECENT_POSTS":
            return { ...state, recentPosts: action.payload }
        case "SET_LOADING_RECENT_POSTS":
            return { ...state, loadingRecentPoasts: action.payload }
        default:
            return state
    }
}


const Home = () => {

    const { user } = useUserContext()
    const [state, dispatch] = useReducer(reducer, initialState)


    const navigate = useNavigate();


    const getBgColor = (index) => {
        return { backgroundColor: getColor(index) };
    };


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function getRecentPostsData() {
            try {
                const response = await getRecentPosts(5, signal);
                dispatch({
                    type: "SET_RECENT_POSTS",
                    payload: response || [],
                });
                dispatch({
                    type: "SET_LOADING_RECENT_POSTS",
                    payload: false,
                });
            } catch (error) {
                dispatch({
                    type: "SET_RECENT_POSTS",
                    payload: [],
                });
                dispatch({
                    type: "SET_LOADING_RECENT_POSTS",
                    payload: false,
                });
                toast.error("Error fetching data!", {
                    position: "top-right",
                });
            }
        }

        getRecentPostsData();

        return () => {
            controller.abort(); // Cleanup the fetch on component unmount
        };
    }, []);



    return (
        <div className="flex flex-col w-full gap-4 ">
            <div className="flex flex-row">
                <h1 className="text-3xl text-[#000] font-bold">{getGreeting()} {user?.firstName}</h1>
            </div>

            <div className="space-y-2">
                {/* Title */}
                <div className="flex flex-row items-center gap-2">
                <h3 className="text-xl font-bold">Recent Posts</h3>
                <BookOpenText size={20} />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-5 gap-2 overflow-y-scroll h-[600px]">
                    {!state.loadingRecentPosts && state.recentPosts.map((item) => {

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
            </div>

        </div>
    );



}

export default Home;