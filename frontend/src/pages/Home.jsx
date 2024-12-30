import { getGreeting } from '../utils/StringUtils';
import { getPosts } from '../api/postApi';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useReducer } from 'react'
import { useUserContext } from '../context/userContext';
import { getColor } from '../utils/Colors';


const initialState = {
    recentPosts: [],
    loadingRecentPoasts: true
}

const reducer = (state, action) => {
    switch(action.type) {
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


    const getBgColor = (index) => {
        return { backgroundColor: getColor(index) };
    };


    // useEffect(() => {

    //     const controller = new AbortController()
    //     const signal = controller.signal
    //     async function getDataPosts() {

    //         try {
    //             const response = await getPosts(signal)
    //             if (response && response.length > 0) {
    //                 dispatch({ type: "SET_POSTS_LOADING", payload: false });
    //                 dispatch({ type: "SET_POSTS", payload: response });
    //             } else if (response && response.length === 0) {
    //                 dispatch({ type: "SET_POSTS_LOADING", payload: false });
    //                 dispatch({ type: "SET_POSTS", payload: [] });
    //             }

    //         } catch (error) {
    //             dispatch({ type: "SET_POSTS_LOADING", payload: false })
    //             dispatch({ type: "SET_POSTS", payload: [] })
    //             toast.error('Error fetching data!', {
    //                 position: "top-right",
    //             })
    //         }
    //     }

    //     getDataPosts()
    //     return () => {
    //         controller.abort()
    //     }

    // }, [])


    return (
        <div className="flex flex-col w-full gap-4 ">
            <div className="flex flex-row">
                <h1 className="text-3xl text-[#000] font-bold">{getGreeting()} {user?.firstName}</h1>
            </div>


            {/* the grid view */}
            <div className="space-y-2">
                {/* Title */}
                <div className="text-xl font-bold">Recent Posts</div>

                {/* Grid */}
                <div className="grid grid-cols-5 gap-2 h-[500px]">
                    {/* 1 (spans multiple cells) */}
                    <div style={getBgColor(0)} className="col-span-3 row-span-2 rounded-lg h-full"></div>

                    {/* 2 */}
                    <div style={getBgColor(1)} className="rounded-lg h-[250px]"></div>

                    {/* 3 */}
                    <div style={getBgColor(2)} className="rounded-lg h-[250px]"></div>

                    {/* 4 */}
                    <div style={getBgColor(3)} className="rounded-lg h-[250px]"></div>

                    {/* 5 */}
                    <div style={getBgColor(4)} className="rounded-lg h-[250px]"></div>
                </div>
            </div>

        </div>
    );



}

export default Home;