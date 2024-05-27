import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaList, FaPlus, FaUser, FaUsers } from 'react-icons/fa';

import useAuth from '../Auth/useAuth';
import Profile from './Profile/Profile';
import AllPosts from './AllPosts/AllPosts';
import NewPost from './NewPost/NewPost';
import Users from './Users/Users';
import Category from './Category/Category';
import UserEdit from './Users/UserEdit';

const Dashboard = () => {
  const user = useAuth();
  if (!user) {
    return null;
  }

  return (
    <Container fluid className="h-100">
      <Row className='h-100'>
        <Col xs={2} className="bg-light sidebar shadow py-3">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard/posts">
              <FaList /> All Posts
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/add-post">
              <FaPlus /> Add New Post
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/users">
              <FaUsers /> Users
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/dashboard/category">
              <FaPlus /> Category
            </Nav.Link> */}
            <Nav.Link as={Link} to="/dashboard/profile">
              <FaUser /> Profile
            </Nav.Link>
          </Nav>
        </Col>
        <Col xs={10} className="content-area">
          <Routes>
            <Route path="/" element={<AllPosts />} />
            <Route path="posts" element={<AllPosts />} />
            <Route path="add-post" element={<NewPost />} />
            <Route path="add-post/:postId" element={<NewPost />} />
            {/* <Route path="category" element={<Category />} /> */}
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserEdit />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
