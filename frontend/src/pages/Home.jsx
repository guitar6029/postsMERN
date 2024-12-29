
import { getPosts, getPost, createPost, updatePost, deletePost } from '../api/postApi';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import PostContainer from '../components/PostContainer';
import { useUserContext } from '../context/userContext';

const Home = () => {
    
    const { user } = useUserContext() 
    const [postsData, setData] = useState([])
    
    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal

        async function getDataPosts() {

            try {
                const response = await getPosts(signal)
                if (response && response.length > 0) {
                    setData(response)
                }

            } catch (error) {
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

    const getGreeting = () => {
        let greeting = '';
        const hour = new Date().getHours();
        if (hour < 12) {
            greeting = 'Good Morning, ';
        } else if (hour < 18) {
            greeting = 'Good Afternoon, ';
        } else {
            greeting = 'Good Evening, ';
        }
    
        return greeting;
    }
    

    const handleSortOrerBy = (sortBy) => {
        //sort data based on sortBy value
        switch (sortBy) {
            case 'dateCreated':
                postsData.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
                setData([...postsData])
                break;
            case 'title':
                postsData.sort((a, b) => a.title.localeCompare(b.title))
                setData([...postsData])
                break;
            case 'author':
                postsData.sort((a, b) => a.author.localeCompare(b.author))
                setData([...postsData])
                break;
            case 'likesCount':
                postsData.sort((a, b) => a.likeCount - b.likeCount)
            default:
                setData([...postsData])
                break;
        }
    }


    if (postsData && postsData.length > 0) {

        return (

            <div className="flex flex-col w-full gap-4 justify-center">
                <div className="greeting flex flex-col gap-2">
                    <h1 className="text-3xl text-white font-semibold">{ getGreeting() } {user?.firstName}</h1>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <div>
                        <select onChange={(e) => handleSortOrerBy(e.target.value)} className="p-2 rounded hover:cursor-pointer" name="sortBy" id="sortBy">
                            <option value="dateCreated">Date Created</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="likesCount">Likes</option>
                        </select>
                    </div>

                </div>

                <div className="flex flex-col gap-1 w-full">

                    {postsData.map((post, index) => {

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

    } else {
        return (
            <>
                <div className="flex flex-col w-full text-center gap-4 justify-center items-center">
                    <div>
                        <h1>Hello {user?.firstName}</h1>
                        <h1 className="text-3xl mb-2">No Posts</h1>
                        <button className="rounded-lg p-2 w-fit bg-[#516DBE] text-white">Create Post</button>
                    </div>
                </div>
                <ToastContainer />
            </>
        )
    }
}

export default Home;