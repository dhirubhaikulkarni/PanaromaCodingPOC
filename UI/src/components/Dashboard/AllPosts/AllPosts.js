import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { getPosts } from '../../Store/postManagementSlice';
import '../AllPosts/AllPost.css';

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
    <Container className="pt-4 h-100">
      <Row>
        {filteredPosts.map((post) => (
          <Col key={post._id} md={12} className="d-flex d-sm-flex justify-content-around mb-4 w-100">
            <Card style={{ width: '100%', height: 'auto' }} className='border-0 shadow pe-auto'>
              <div className='d-lg-flex p-3'>
                <Card.Img className='rounded-3 c-w-100 my-3 my-lg-0' style={{ width: '20%' }} variant="top" src="https://th.bing.com/th/id/OIP.au547IWsqSQUkUwyd7LHZAHaEK?rs=1&pid=ImgDetMain" />
                <Card.Body className="p-0 px-lg-3 d-flex justify-content-between align-items-center w-100">
                  <div className='w-100'>
                    <div class="row">
                      <Card.Title className='col-9 col-lg-10 fs-3 fw-semibold'>{post.title}</Card.Title>
                      <div className='col-3 col-lg-2 d-flex justify-content-end align-items-center'>
                        
                        <Link to={`/dashboard/add-post/${post._id}`} className="mx-3">
                          <FaEdit size={20} className="text-primary" />
                        </Link>

                        <FaTrash
                          size={20}
                          className="text-danger"
                          onClick={() => handleDelete(post._id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <strong className="col-3 col-lg-2 text-nowrap">Author:</strong>
                      <div className="col-9 col-lg-10 text-nowrap">{post.authorName}</div>
                    </div>
                    <div className="row">
                      <strong className="col-3 col-lg-2 text-nowrap">Category:</strong>
                      <div className="col-9 col-lg-10 text-nowrap">{post.categoryName}</div>
                    </div>
                    <div className="row">
                      <strong className="col-3 col-lg-2 text-nowrap">Created At:</strong>
                      <div className="col-9 col-lg-10 text-nowrap">{new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="row">
                      <strong className="col-3 col-lg-2 text-nowrap">Updated At:</strong>
                      <div className="col-9 col-lg-10 text-nowrap">{new Date(post.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllPosts;
