import { deletePost } from "../api/postApi";
import { getPost } from "../api/postApi";
import { toast} from "react-toastify";
import { updateLikeForPost } from "../api/likesApi";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { userAllowedToDeletePost, updatePost } from "../api/postApi";
import axios from "axios";

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
    singlePostData: {},
    id: null,
    maxCharacterLimit: 1000
}


const reducer = (state, action) => {
    switch (action.type) {
        case 'RESET_CHANGES':
            //original text
            return { ...state, editText: state.singlePostData.description , editTitle: state.singlePostData.title };
        case 'SET_ID':
            return { ...state, id: action.payload };
        case 'SET_EDIT_TEXT':
            return { ...state, editText: action.payload };
        case 'SET_EDIT_TITLE':
            return { ...state, editTitle: action.payload };
        case 'SET_EDIT_MODE':
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


const usePostHandler = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const checkIfCanDeletePost = async () => {
            try {
                const response = await userAllowedToDeletePost(state.id, signal);
                if (response && response.status === 200) {
                    dispatch({ type: "SET_ALLOWED_TO_DELETE_POST", payload: true });
                    dispatch({ type: "SET_OWNER_OF_POST", payload: true });
                    dispatch({ type: "SET" })
                }
            } catch (error) {
                dispatch({ type: "SET_ALLOWED_TO_DELETE_POST", payload: false });
                toast.error('Error deleting post!', { position: "top-right" });
            }
        }

        checkIfCanDeletePost();

        return () => {
            controller.abort();
        }
    }, [state.id]);

    const confirmModalForPostDelete = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: true });
    }

    const setIdForPost = (id: number) => {
        if (id) {
            dispatch({ type: 'SET_ID', payload: id });
        }
    }

    const resetChangesForEditPost = () => {
        dispatch({ type: 'RESET_CHANGES' });
    }

    const handleDeletePost = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await deletePost(state.id, signal);
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

            if (state.id) {
                console.log('id for getting post data is', state.id)
                try {
                    const postFetch = await getPost(state.id, signal);
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
        }

        getPostData();

        return () => {
            controller.abort();
        }
    }, [state.id]);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: false });
    }

    const handleModalAndCallback = () => {
        dispatch({ type: 'SET_CONFIRM_MODAL_OPEN', payload: false });
        //handleDeletePost();
    }

    const handleEditModeUpdateTitle = (title: string) => {
        dispatch({ type: 'SET_EDIT_TITLE', payload: title });
    }
    

    const handleEditModeUpdateText = (text: string) => {
        dispatch({ type: 'SET_EDIT_TEXT', payload: text });
    }

    const handleUpdatePost = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        const postId = state.id;
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
            if (response && response === 200) {
                toast.success('Post updated successfully!', { position: "top-right" });
                dispatch({ type: 'SET_EDIT_MODE', payload: false });
                // make the default text and titel of the updated post
                dispatch({ type: 'SET_SINGLE_POST_DATA', payload: { title: state.editTitle, description: state.editText } }); 
                dispatch({ type: 'SET_EDIT_TITLE', payload: state.editTitle }); 
                dispatch({ type: 'SET_EDIT_TEXT', payload: state.editText });
            } else {
                toast.error('Error updating post!', { position: "top-right" });
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                toast.error('Error updating post!', { position: "top-right" });
            } else {
                toast.error('Error updating post!', { position: "top-right" });
            }
        }
    }


    const handleEditModeClick = (isEditMode) => {
        dispatch({ type: 'SET_EDIT_MODE', payload: isEditMode });
    }

    const handleLikeClick = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const likeChange = state.alreadyLiked ? -1 : 1;
            const response = await updateLikeForPost(state.id, { likeChange }, signal);
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


   

    return { state, resetChangesForEditPost, setIdForPost, dispatch, handleDeletePost, handleModalAndCallback, handleCloseModal, handleUpdatePost, handleLikeClick, confirmModalForPostDelete, handleEditModeClick, handleEditModeUpdateTitle,  handleEditModeUpdateText };
}

export default usePostHandler;