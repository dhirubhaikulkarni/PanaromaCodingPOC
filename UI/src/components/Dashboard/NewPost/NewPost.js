import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, getCategories } from '../../Store/postManagementSlice';

const NewPost = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [author, setAuthor] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);
  const categories = useSelector(state => state.post.categories);

  const loading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const success = useSelector((state) => state.post.success);

  useEffect(() => {
    try {
      dispatch(getCategories())
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    // Retrieve user information from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAuthor(user.username);
    }
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addPost(title, content, selectedCategory))
    clearAll()

  };

  const clearAll = () => {
    setTitle('');
    setContent('');
    setSelectedCategory('');
  };


  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Add New Post</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicContent" className="mb-5">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                className="quill-editor"
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: '1' }, { header: '2' }, { font: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ align: [] }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
                formats={[
                  'header',
                  'font',
                  'size',
                  'bold',
                  'italic',
                  'underline',
                  'strike',
                  'blockquote',
                  'list',
                  'bullet',
                  'indent',
                  'link',
                  'image',
                  'align',
                ]}
                placeholder="Write your content here..."
                style={{ height: '200px', marginBottom: '20px' }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCategories" className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Row>
                {categories.map(category => (
                  <Col xs={6} key={category._id}>
                    <Form.Check
                      type="radio"
                      label={category.name}
                      name="category"
                      value={category._id}
                      checked={selectedCategory === category._id}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Form.Group controlId="formBasicAuthor" className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={author}
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Post'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPost;
