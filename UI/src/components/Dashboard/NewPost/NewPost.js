import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost, getCategories, getPosts } from '../../Store/postManagementSlice';

const NewPost = () => {
  const { postId } = useParams();  // Get postId from route params
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [author, setAuthor] = useState('');
  const categories = useSelector(state => state.post.categories);
  const posts = useSelector(state => state.post.data);

  const loading = useSelector(state => state.post.loading);
  const error = useSelector(state => state.post.error);
  const success = useSelector(state => state.post.success);

  useEffect(() => {
    dispatch(getCategories());

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAuthor(user.username);
    }

    if (postId && posts.length > 0) {
      const post = posts.find(post => post._id === postId);
      console.log("post", post);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setSelectedCategory(post.category);
      }
    }
  }, [dispatch, postId, posts]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (postId) {
      debugger;
      dispatch(updatePost(postId, title, content, selectedCategory));
      dispatch(getPosts()); 
    } else {
      dispatch(addPost(title, content, selectedCategory));
      dispatch(getPosts()); 
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>{postId ? 'Edit Post' : 'Add New Post'}</h2>
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
              {loading ? <Spinner animation="border" size="sm" /> : postId ? 'Update Post' : 'Add Post'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPost;
