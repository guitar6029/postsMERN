import axios from "axios";
import { URI } from "./uri";

export const saveToBookmarks = async (id, signal) => {
    if (!id) {
        return {
            success: false,
            message: "Invalid post id!"
        };
    }

    try {
        const response = await axios.post(
            `${URI}/bookmarks/add/${id}`,
            { id },
            { signal }
        );

        if (response.status === 200) {
            return {
                success: true,
                message: "Post saved to bookmarks!"
            };
        } else {
            return {
                success: false,
                message: "Error saving post to bookmarks!"
            };
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            return {
                success: false,
                message: "Request was canceled!"
            };
        } else {
            return {
                success: false,
                message: "Error saving post to bookmarks!"
            };
        }
    }
};


export const checkIfPostWasSavedToBookMarks = async (id) => {
    if (!id) {
        return {
            success: false,
            message: "Invalid post id!"
        };
    }

    try {
        const response = await axios.get(
            `${URI}/bookmarks/check/${id}`)
        if (response.status === 200) {
            return {
                success: true,
                message: "Post already saved to bookmarks!"
            };
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            return {
                success: false,
                message: "Request was canceled!"
            };
        } else {
            return {
                success: false,
                message: "Error saving post to bookmarks!"
            };
        }
    }
}

export const removeFromBookmarks = async (id, signal) => {
    if (!id) {
        return
    }

    try {


        const response = await axios.delete(`${URI}/bookmarks/remove/${id}`, { signal });
        if (response && response.status === 200) {
            return {
                success: true,
                message: "Post removed from bookmarks"
            }
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            return {
                success: false,
                message: "Request was canceled!"
            };
        } else {
            return {
                success: false,
                message: "Error removing post from bookmarks!"
            };
        }
    }
}