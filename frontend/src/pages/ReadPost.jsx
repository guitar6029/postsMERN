import { deletePost } from "../api/postApi";
import { getPost } from "../api/postApi";
import { ThumbsUp, BookmarkPlus, Trash2, PencilLine } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import { updateLikeForPost } from "../api/likesApi";
import { useEffect, useReducer, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/modal/modal";
import { userAllowedToDeletePost, updatePost } from "../api/postApi";
import { getDateString } from "../utils/DateUtil";

const initialState = {
    allowedToDeletePost: false,
    alreadyLiked: false,
    confirmModalIsOpen: false,
    editMode: false,
    likeCount: 0,
    ownerOfPost: false,
    savedToBookmarks: false,
    editText: '',
    editTitle: '',
    singlePostData: {}
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_EDIT_TEXT':
            return { ...state, editText: action.payload };
        case 'SET_EDIT_TITLE':
            return { ...state, editTitle: action.payload };
        case 'SET_EDIT_MODE':
            console.log('edit mode', action.payload);
            return { ...state, editMode: action.payload };
        case 'SET_OWNER_OF_POST':
            return { ...state, ownerOfPost: action.payload };
        case 'SET_SINGLE_POST_DATA':
            return { ...state, singlePostData: { ...state.singlePostData, ...action.payload } };
        case 'SET_LIKE_COUNT':
            return { ...state, likeCount: state.likeCount + action.payload };
        case 'SET_ALREADY_LIKED':
            return { ...state, alreadyLiked: action.payload };
        case 'SET_CONFIRM_MODAL_OPEN':
            return { ...state, confirmModalIsOpen: action.payload };
        case 'SET_SAVED_TO_BOOKMARKS':
            return { ...state, savedToBookmarks: action.payload };
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

    const inputTitleRef = useRef(null);

    useEffect(() => {
        if ( state.editMode ) {
            inputTitleRef.current.focus();
        }
    }, [state.editMode]);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const checkIfCanDeletePost = async () => {
            try {
                const response = await userAllowedToDeletePost(id, signal);
                if (response && response.status === 200) {
                    dispatch({ type: "SET_ALLOWED_TO_DELETE_POST", payload: true });
                    dispatch({ type: "SET_OWNER_OF_POST", payload: true });
                    dispatch({ type: "SET"})
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
                    dispatch({ type: 'SET_EDIT_TITLE', payload: postFetch.title });
                    dispatch({ type: 'SET_EDIT_TEXT', payload: postFetch.description });
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
        //handleDeletePost();
    }

    const handleUpdatePost = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        const postId = id;
        const updatePostObj = {
            title: state.editTitle,
            description: state.editText
        }
        if (!updatePostObj.title || !updatePostObj.description) {
            toast.error('Title and description are required!', { position: "top-right" });
            return;
        }

        try {
            const response = await updatePost(postId, updatePostObj, signal);
            console.log('frontend response', response);
            if (response && response === 200) {
                toast.success('Post updated successfully!', { position: "top-right" });
                dispatch({ type: 'SET_EDIT_MODE', payload: false });
            } else {
                toast.error('Error updating post!', { position: "top-right" });
            }
        } catch(error) {
            if (axios.isCancel(error)) {
                toast.error('Error updating post!', { position: "top-right" });
            } else {
                toast.error('Error updating post!', { position: "top-right" });
            }
    }
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


    // save to bookmarks
    const handleSaveToBookmarks = (toSaveBookMark) => {

    }

    return (
        <>
            {state.confirmModalIsOpen && (
                <Modal typeOfConfirmation="delete" onClose={handleCloseModal} onDelete={handleModalAndCallback} />
            )}

            <div className="flex flex-col rounded-lg gap-4 p-4">
                <div className="flex flex-row items-center justify-between">
                    {state.editMode ? (
                        <input ref={inputTitleRef} value={state.editTitle} className="text-2xl sm:text-sm md:text-2xl lg:text-2xl xl:text-2xl font-semibold " onChange={(e) => dispatch({ type: 'SET_EDIT_TITLE', payload: e.target.value })}   type="text" name="editTitle" id="editTitle" />
                    ) : (
                    <h3 className="text-2xl sm:text-sm md:text-2xl lg:text-2xl xl:text-2xl font-semibold">{state.singlePostData.title}</h3>    
                    )}
                    <div className="flex flex-row gap-2">
                        {state.ownerOfPost && (

                        <div onClick={() => dispatch({type: 'SET_EDIT_MODE', payload: true})}  className="flex flex-row items-center cursor-pointer text-sm p-2 bg-gray-200 rounded-lg">
                            <span>Edit</span>
                            <PencilLine />
                        </div>
                        )}
                        <div onClick={handleSaveToBookmarks} className="flex flex-row items-center text-sm bg-gray-200 rounded-lg p-2 cursor-pointer">
                            <span>Bookmark</span>
                            <BookmarkPlus />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-base" >by</span>
                    <h5 className="text-xl font-medium">{state.singlePostData.author}</h5>
                    <span className="text-gray-400">|</span>
                    {state.singlePostData.updatedAt ? (
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-base">Updated at</span>
                            <span className="font-medium text-base">{getDateString(state.singlePostData.updatedAt)}</span>    

                        </div>
                    ) : (
                        
                    <span className="font-medium text-base">{getDateString(state.singlePostData.dateCreated)}</span>
                    )}

                </div>
                {state.editMode ? (
                    <textarea className="min-h-[500px] rounded-lg p-1 " onChange={(e) => dispatch({ type: "SET_EDIT_TEXT", payload: e.target.value })} required maxLength={1000}  value={state.editText} type="text" name="description" id="description" />
                ) : 
                <div className="flex flex-row gap-2 p-4 bg-white text-black rounded-lg">
                    <p>{state.singlePostData.description}</p>
                </div>
                
                }
                <div className="flex flex-row items-center justify-between gap-2">
                    {state.editMode ? (
                        <button className="p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50" onClick={handleUpdatePost}>Update Post</button>
                    ) : (
                    <div className="flex flex-row items-center gap-2">
                        <button onClick={handleLikeClick} className={`hover:scale-110 transition duration-300 ease-in ${state.alreadyLiked ? 'text-blue-500 cursor-default' : 'hover:cursor-pointer'}`} disabled={state.alreadyLiked}>
                            <ThumbsUp />
                        </button>
                        <span className="font-bold">Likes</span>
                        <span className="flex flex-row items-center justify-center p-2 w-10 bg-white rounded-full text-black font-bold">
                            {state.singlePostData.likeCount}
                        </span>
                    </div>
                        
                    )}
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
