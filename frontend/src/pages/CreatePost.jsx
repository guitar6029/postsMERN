import { createPost } from '../api/postApi';
import { StickyNote } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { useUserContext } from '../context/userContext';

const CreatePost = () => {

    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")


    const handlePostSubmit = async (event) => {
        event.preventDefault()

        const controller = new AbortController()
        const signal = controller.signal

        //prevent default form submission
        try {
            const postObject = {
                title: title,
                description: description,
                author: author,
                dateCreated: new Date(),
                likeCount: 0
            }

            let response = await createPost(postObject, signal)
          
            if (response && response.status === 201) {
                toast.success('Post created successfully!', { position: "top-right", })
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
                    <input onChange={(e) => setTitle(e.target.value)} required className="rounded-lg p-1" value={title} type="text" name="title" id="title" placeholder='Amazing Title Worth Reading...' />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                        <h3 className="font-semibold">Author </h3>
                        <span>( That&apos;s you )</span>
                    </div>
                    <input onChange={(e) => setAuthor(e.target.value)} required className="rounded-lg p-1" type="text" name="author" id="author" placeholder='Your Name' />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">Description</h3>
                    <textarea onChange={(e) => setDescription(e.target.value)} required maxLength={1000} className="rounded-lg p-1 " type="text" name="description" id="description" placeholder='Write Something cool...' />
                </div>
                <div className="flex flex-row mt-2">
                    <button type="submit" disabled={!title || !author || !description} className="p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50">Post It ! 🚀 </button>
                </div>
            </div>
        </form>
        <ToastContainer />
    </>);
}

export default CreatePost;