import { deletePost } from "../api/postApi";
import { getColor } from "../utils/Colors";
import { getPost } from "../api/postApi";
import { ThumbsUp, Heart, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import { updateLikeForPost } from "../api/likesApi";
import { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/modal/modal";
import { userAllowedToDeletePost } from "../api/postApi";
import { getDateString } from "../utils/DateUtil";

const initialState = {
    singlePostData: {},
    likeCount: 0,
    alreadyLiked: false,
    bgColor: '',
    confirmModalIsOpen: false,
    allowedToDeletePost: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SINGLE_POST_DATA':
            return { ...state, singlePostData: { ...state.singlePostData, ...action.payload } };
        case 'SET_LIKE_COUNT':
            return { ...state, likeCount: state.likeCount + action.payload };
        case 'SET_ALREADY_LIKED':
            return { ...state, alreadyLiked: action.payload };
        case 'SET_CONFIRM_MODAL_OPEN':
            return { ...state, confirmModalIsOpen: action.payload };
        case 'SET_BG_COLOR':
            return { ...state, bgColor: action.payload };
        case 'SET_ALLOWED_TO_DELETE_POST':
            return { ...state, allowedToDeletePost: action.payload };
        default:
            return state;
    }
}

const ReadPost = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const bgColor = getColor(Math.floor(Math.random() * 10));
        dispatch({ type: 'SET_BG_COLOR', payload: bgColor });
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const checkIfCanDeletePost = async () => {
            try {
                const response = await userAllowedToDeletePost(id, signal);
                if (response && response.status === 200) {
                    dispatch({ type: "SET_ALLOWED_TO_DELETE_POST", payload: true });
                }
            } catch (error) {
                dispatch({ type: "SET_ALLOWED_TO_DELETE_POST", payload: false });
                toast.error('Error deleting post!', { position: "top-right" });
            }
        }

        checkIfCanDeletePost(id);

        return () => {
            controller.abort();
        }
    }, [id]);

    const confirmModalForPostDelete = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: true });
    }

    const handleDeletePost = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await deletePost(id, signal);
            if (response && response.status === 200) {
                toast.success('Post deleted successfully!', { position: "top-right" });
                navigate('/home');
            } else {
                toast.error('Error deleting post!', { position: "top-right" });
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                toast.error('Error deleting post!', { position: "top-right" });
            } else {
                toast.error('Error deleting post!', { position: "top-right" });
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function getPostData() {
            try {
                const postFetch = await getPost(id, signal);
                if (postFetch) {
                    dispatch({ type: 'SET_SINGLE_POST_DATA', payload: postFetch });
                    dispatch({ type: 'SET_LIKE_COUNT', payload: postFetch.likeCount });
                    dispatch({ type: 'SET_ALREADY_LIKED', payload: postFetch.alreadyLiked });
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                    toast.error('Error fetching post!', { position: "top-right" });
                } else {
                    toast.error('Error fetching post!', { position: "top-right" });
                }
            }
        }

        getPostData();

        return () => {
            controller.abort();
        }
    }, [id]);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: false });
    }

    const handleModalAndCallback = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: false });
        handleDeletePost();
    }

    const handleLikeClick = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const likeChange = state.alreadyLiked ? -1 : 1;
            const response = await updateLikeForPost(id, { likeChange }, signal);
            if (response) {
                dispatch({ type: 'SET_LIKE_COUNT', payload: likeChange });
                dispatch({ type: 'SET_ALREADY_LIKED', payload: !state.alreadyLiked });
                dispatch({ type: 'SET_SINGLE_POST_DATA', payload: { likeCount: response.likeCount } });
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                toast.error('Error!', { position: "top-right" });
            } else {
                console.error("Error fetching data:", error);
            }
        }

        // Clean up the controller
        return () => {
            controller.abort();
        }
    }

    return (
        <>
            {state.confirmModalIsOpen && (
                <Modal typeOfConfirmation="delete" onClose={handleCloseModal} onDelete={handleModalAndCallback} />
            )}

            <div className="flex flex-col rounded-lg gap-4 p-4">
                <div className="flex flex-row items-center justify-between">
                    <h3 className="text-2xl sm:text-sm md:text-2xl lg:text-2xl xl:text-2xl font-bold">{state.singlePostData.title}</h3>
                    <Heart className="hover:scale-110 cursor-pointer hover:fill-rose-300 transition duration-300 ease-in" />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span>Posted by | </span>
                    <h5 className="font-bold italic">{state.singlePostData.author}</h5>
                </div>
                <span className="font-semibold text-sm">{getDateString(state.singlePostData.dateCreated)}</span>
                <div className="flex flex-row gap-2 p-4 bg-white text-black rounded-lg">
                    <p>{state.singlePostData.description}</p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <button onClick={handleLikeClick} className={`hover:scale-110 transition duration-300 ease-in ${state.alreadyLiked ? 'text-blue-500' : ''}`} disabled={state.alreadyLiked}>
                            <ThumbsUp />
                        </button>
                        <span className="font-bold">Likes</span>
                        <span className="flex flex-row items-center justify-center p-2 w-10 bg-white rounded-full text-black font-bold">
                            {state.singlePostData.likeCount}
                        </span>
                    </div>
                    {state.allowedToDeletePost && (
                        <div className="flex flex-row justify-end">
                            <div className="rounded-full w-fit p-2 hover:scale-105 hover:cursor-pointer">
                                <Trash2 onClick={confirmModalForPostDelete} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default ReadPost;
