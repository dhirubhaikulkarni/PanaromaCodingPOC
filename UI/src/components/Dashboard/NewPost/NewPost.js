import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/categories');
        const activeCategories = response.data.filter(category => category.isActive);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

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
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:4000/api/posts/addPost', {
        title,
        content,
        author: JSON.parse(localStorage.getItem('user'))._id, 
        categoryId: selectedCategory, 
      });
      if (response.status === 200) {
        setSuccess('Post added successfully!');
        setTitle('');
        setContent('');
        setSelectedCategory('');
      }
    } catch (error) {
      setError('Failed to add post.');
    }
    setLoading(false);
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
