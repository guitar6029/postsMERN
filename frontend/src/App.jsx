import './App.css';
import './custom-classes.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Page404 from './pages/Page404';
import Landing from './pages/Landing';
import Account from './pages/Account';
import ReadPost from './pages/ReadPost';
import CreatePost from './pages/CreatePost';
import CreateNewUser from './pages/CreateNewUser';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import Layout from './components/Layout';
import TrendingPosts from './pages/TrendingPosts';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import axios from 'axios';
import { UserProvider } from './context/userContext';

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
    </UserProvider>
  );
}

export default App;
