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
import Signup from './components/Auth/Signup';
import { Provider } from 'react-redux';
import rootReducers from './components/Store/rootReducers'

function App() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  axios.interceptors.request.use((req) => {
    debugger;
    console.log("Api call",localStorage.getItem('jwt_token'))
    req.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    req.headers['Content-Type'] = 'application/json';
    return req;
  });
  
  
  axios.interceptors.response.use(response => {
    console.log("Response Call")
    if (localStorage.getItem('jwt_token') !== null && localStorage.getItem('jwt_token') !== undefined) {
      if (response.headers.hasOwnProperty("authorization")) {
        const validToken = response.headers.authorization;
        if (validToken !== 'NaN' && validToken !== null && validToken !== undefined) {
          const newToken = response.headers.authorization.replace('Bearer', '').trim();
          if (localStorage.getItem('jwt_token') !== newToken) {
            localStorage.setItem('jwt_token', newToken);
          }
        }
      }
    }
    return response;
  
  }, error => {
    if (error.response.status === 401) {
      // window.location = `${window.location.origin}`;
  
    }
    return error;
  });


  return (
    <Provider store={rootReducers}>
      <Router>
        <div className="App" style={{height:'100%'}}>
          <Header />

          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/posts" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>

          {/* <Footer /> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import axios from 'axios';
// import { Header } from './components/Header';
// import Footer from './components/Footer';

// import { Container, Spinner } from 'react-bootstrap';
// import PostList from './components/Posts/PostList';
// import PostDetails from './components/Posts/PostDetails';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import Dashboard from './components/Dashboard/Dashboard';

// function App() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/posts');
//         setPosts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <Router>
//       <div className="App">
//         <Header />
//         <Container className="content">
//           {loading ? (
//             <Spinner animation="border" role="status">
//               <span className="sr-only"></span>
//             </Spinner>
//           ) : (
//             <Routes>
//               <Route path="/" element={<PostList posts={posts} />} />
//               <Route path="/post/:id" element={<PostDetails posts={posts} />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//             </Routes>
//           )}
//         </Container>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
