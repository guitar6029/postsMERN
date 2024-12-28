import { useContext, createContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap your app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserProperties = (userData) => {
        setUser(userData)
    }

    return (
        <UserContext.Provider value={{ user, setUserProperties }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext)
