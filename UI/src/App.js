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




  return (
    <Provider store={rootReducers}>
      <Router>
        <div className="App">
          <Header />

          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>

          <Footer />
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
