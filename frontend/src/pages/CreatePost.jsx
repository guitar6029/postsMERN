import { createPost } from '../api/postApi';
import { StickyNote } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

    const initialState = {
        title: "",
        description: ""
    }

    const navigate = useNavigate();


    const reducer = (state, action) => {
        switch (action.type) {
            case "SET_TITLE":
                return { ...state, title: action.payload }

            case "SET_DESCRIPTION":
                return { ...state, description: action.payload }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

   

    const handlePostSubmit = async (event) => {
        event.preventDefault()

        const controller = new AbortController()
        const signal = controller.signal

        try {
            const postObject = {
                title: state.title,
                description: state.description,
                dateCreated: new Date(),
                likeCount: 0
            }

            let response = await createPost(postObject, signal)

            if (response && response.status === 201) {
                toast.success('Post created successfully!', { position: "top-right", })
                navigate("/home")
            }
        } catch (error) {
            toast.error('Error creating post!', { position: "top-right", })

        }

    }

    return (<>
        <form onSubmit={handlePostSubmit} >

            <div className="flex flex-col gap-4 w-full p-4 bg-slate-100 rounded-lg ">
                <div className="flex flex-row items-center gap-2">
                    <span className="text-2xl font-bold">Create Post </span>
                    <StickyNote />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">Title</h3>
                    <input onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })} required className="rounded-lg p-1" value={state.title} type="text" name="title" id="title" placeholder='Amazing Title Worth Reading...' />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">Description</h3>
                    <textarea onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })} required maxLength={1000} className="rounded-lg p-1 " value={state.description} type="text" name="description" id="description" placeholder='Write Something cool...' />
                </div>
                <div className="flex flex-row gap-2">
                    <span>Add Tags</span>
                    
                </div>
                <div className="flex flex-row mt-2">
                    <button type="submit" disabled={!state.title || !state.description} className="p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50">Post It ! 🚀 </button>
                </div>
            </div>
        </form>
        <ToastContainer />
    </>);
}

export default CreatePost;