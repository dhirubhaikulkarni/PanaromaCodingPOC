import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Footer from './components/Footer';
import { Header } from './components/Header';
import Container from 'react-bootstrap/Container';
import PostList from './components/Posts/PostList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostDetails from './components/Posts/PostDetails';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './components/Auth/ResetPassword';
import Signup from './components/Auth/Signup';
import { Provider } from 'react-redux';
import rootReducers from './components/Store/rootReducers'


function App() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  axios.interceptors.request.use((req) => {

    req.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    req.headers['Content-Type'] = 'application/json';
    return req;
  });


  axios.interceptors.response.use(response => {

    return response;

  }, error => {
    if (error.response.status === 401) {
      window.location = `${window.location.origin}`;
      // Clear local storage
      localStorage.clear();


    }
    return error;
  });


  return (
    <Provider store={rootReducers}>
      <Router>
        <div className="App" style={{ height: '100%' }}>
          <Header />

          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/posts" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
          </Routes>

          {/* <Footer /> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
