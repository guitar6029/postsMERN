import './App.css';
import './custom-classes.css';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import { useEffect } from 'react';
import { UserProvider } from './context/userContext';
import Account from './pages/Account';
import axios from 'axios';
import CreateNewUser from './pages/CreateNewUser';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Page404 from './pages/Page404';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import ReadPost from './pages/ReadPost';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import TrendingPosts from './pages/TrendingPosts';

function App() {
  // Watch axios headers authorization
  useEffect(() => {
    const userSessionItem = sessionStorage.getItem('token');
    if (userSessionItem) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + userSessionItem;
    }
  }, []);

  return (
    <UserProvider>
      <Routes>
        {/* The root path "/" will render Landing component */}
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<CreateNewUser />} />
        {/* All other routes will be nested inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="trending" element={<ProtectedRoute><TrendingPosts /></ProtectedRoute>} />
          <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="readpost/:id" element={<ProtectedRoute><ReadPost /></ProtectedRoute>} />
          ,<Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute> } />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          {/* Add a wildcard route to catch all other paths */}
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
     <ToastContainer />
    </UserProvider>
  );
}

export default App;
