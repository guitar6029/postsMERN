import { useContext, createContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap your app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    const handleToasts = ({ type, message }) => {
        if (type === 'error') {
            toast.error(message, { position: "top-right" }); 
        } else if (type === 'success') {
            toast.success(message, { position: "top-right" });
        }
    };


    useEffect(() => {
        // Load user data from session storage on initial mount
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        }
    }, []);

    const setUserProperties = (userData) => {
        if (userData) {
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
    };

    return (
        <UserContext.Provider value={{ user, setUserProperties, handleToasts }}>
            {children}
            <ToastContainer />
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
