import { useContext, createContext, useState, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap your app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

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
        <UserContext.Provider value={{ user, setUserProperties }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
