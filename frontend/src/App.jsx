import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Account from './pages/Account'
import ReadPost from './pages/ReadPost'
import CreatePost from './pages/CreatePost'
import CreateNewUser from './components/CreateNewUser'
import Layout from './components/Layout'
import axios from 'axios'

function App() {

  //watch axios headers authorization
  useEffect(() => {
    if (sessionStorage.getItem('User') === null) {

      return;
    } else {
      axios.defaults.headers.common["Authorization"] = "Bearer " + sessionStorage.getItem('User');

    }
  }, [])


  const navigate = useNavigate();
  useEffect(() => {
    const userSessionItem = sessionStorage.getItem("User");
    if (userSessionItem === null) {
      navigate('/');

    }
  }, [navigate]);


  return (

    <Routes> {/* The root path "/" will render Landing component */}
      <Route path="/" element={<Landing />} />
      <Route path="/join" element={<CreateNewUser />} />
      {/* All other routes will be nested inside Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="createpost" element={<CreatePost />} />
        <Route path="readpost/:id" element={<ReadPost />} />
        {/* Add a wildcard route to catch all other paths */}
        <Route path="*" element={<Landing />} />
      </Route>
    </Routes>

  )
}

export default App
