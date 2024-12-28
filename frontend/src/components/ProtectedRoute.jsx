import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userSessionItem = sessionStorage.getItem("token");

  if (!userSessionItem) {
    // If user is not logged in, redirect to the landing page
    return <Navigate to="/" />;
  }

  // If user is logged in, render the children components (protected content)
  return children;
}

export default ProtectedRoute;
