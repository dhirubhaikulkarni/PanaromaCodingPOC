import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { getPosts } from '../../Store/postManagementSlice';

const AllPosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.post.data);
  const user = useSelector(state => state.user.user);
  console.log("user", user);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);


  const handleDelete = async (postId) => {
    try {
      // await axios.delete(`http://localhost:4000/api/posts/${postId}`);
      // dispatch(getPosts()); // Refresh posts after deletion
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  const filteredPosts = user.role === 'admin' ? posts : posts.filter(post => post.author === user._id);

  return (
    <Container className="mt-5">
      <Row>
        {filteredPosts.map((post) => (
          <Col key={post._id} md={12} className="mb-4">
            <Card className="d-flex flex-row align-items-center">
              <Card.Body className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <Card.Title>{post.title}</Card.Title>
                  <div className="d-flex flex-column">
                    <div className="d-flex">
                      <strong>Author:</strong>
                      <span className="ml-2">{post.authorName}</span>
                    </div>
                    <div className="d-flex">
                      <strong>Category:</strong>
                      <span className="ml-2">{post.categoryName}</span>
                    </div>
                    <div className="d-flex">
                      <strong>Created At:</strong>
                      <span className="ml-2">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="d-flex">
                      <strong>Updated At:</strong>
                      <span className="ml-2">{new Date(post.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to={`/edit-post/${post._id}`} className="mr-3">
                    <FaEdit size={20} className="text-primary" />
                  </Link>
                  <FaTrash
                    size={20}
                    className="text-danger"
                    onClick={() => handleDelete(post._id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllPosts;
