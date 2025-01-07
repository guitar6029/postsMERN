import { getDateString } from "../utils/DateUtil";
import usePostHandler from "../hooks/usePostHandler";
import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { ThumbsUp, BookmarkPlus, Trash2, PencilLine } from 'lucide-react';
import Modal from "../components/modal/Modal";

const ReadPost = () => {

    const params = useParams();
    const id = params.id;

    const { 
        state, 
        handleEditModeUpdateText, 
        resetChangesForEditPost, 
        setIdForPost, 
        handleLikeClick, 
        handleModalAndCallback, 
        handleCloseModal, 
        confirmModalForPostDelete, 
        handleEditModeClick, 
        handleEditModeUpdateTitle, 
        handleUpdatePost 
    } = usePostHandler()

    useEffect(() => {
        setIdForPost(id);
    }, [id]);


    const inputTitleRef = useRef(null);

    useEffect(() => {
        if (state.editMode) {
            inputTitleRef.current.focus();
        }
    }, [state.editMode]);


    return (
        <>

            {state.confirmModalIsOpen && (
                <Modal typeOfConfirmation="delete" onClose={handleCloseModal} onDelete={handleModalAndCallback} />
            )}

            <div className="flex flex-col rounded-lg gap-4 p-4">
                <div className="flex flex-row items-center justify-between">
                    {state.editMode ? (
                        <input ref={inputTitleRef} value={state.editTitle} className="text-2xl sm:text-sm md:text-2xl lg:text-2xl xl:text-2xl font-semibold " onChange={(e) => handleEditModeUpdateTitle(e.target.value)} type="text" name="editTitle" id="editTitle" />
                    ) : (
                        <h3 className="text-2xl sm:text-sm md:text-2xl lg:text-2xl xl:text-2xl font-semibold">{state.singlePostData.title}</h3>
                    )}
                    <div className="flex flex-row gap-2">
                        {state.ownerOfPost && (

                            <div onClick={() => handleEditModeClick()} className="flex flex-row gap-2 items-center cursor-pointer text-sm p-2 bg-gray-200 rounded-lg">
                                <span>Edit Mode : </span>
                                <span className="font-bold">{state.editMode ? "ON" : "OFF"}</span>
                                <PencilLine />
                            </div>
                        )}
                        <div className="flex flex-row items-center text-sm bg-gray-200 rounded-lg p-2 cursor-pointer">
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
                    <textarea value={state.editText} className="min-h-[300px] rounded-lg p-1 " onChange={(e) => handleEditModeUpdateText(e.target.value)} required maxLength={1000} type="text" name="description" id="description" />
                ) :
                    <div className="flex flex-row gap-2 p-4 bg-white text-black rounded-lg">
                        <p>{state.singlePostData.description}</p>
                    </div>

                }
                <div className="flex flex-row items-center justify-between gap-2">
                    {state.editMode ? (
                        <div className="flex flex-col gap-2">
                            <span>Character Limit {state.editText.length}/1000</span>
                        <div className="flex flex-row items-center gap-2">
                            <button className="p-2 bg-teal-100 rounded-lg hover:bg-teal-500 transition duration-300 ease-in-out hover:text-white disabled:opacity-50" onClick={handleUpdatePost}>Update Post</button>
                            <button onClick={resetChangesForEditPost} className="p-2 rounded-lg bg-green-100">Reset Changes</button>

                        </div>
                        </div>
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
        </>
    );
}

export default ReadPost;
