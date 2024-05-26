import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost, getCategories, getPosts } from '../../Store/postManagementSlice';
import { useNavigate } from 'react-router-dom';

const NewPost = () => {
  const { postId } = useParams();  // Get postId from route params
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [author, setAuthor] = useState('');
  const categories = useSelector(state => state.post.categories);
  const posts = useSelector(state => state.post.data);
  const navigate = useNavigate();

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
    else {
      setTitle('')
      setContent('')
      setSelectedCategory('')
    }
  }, [dispatch, postId, posts]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function previousPage() {
    setTitle('')
    setContent('')
    setSelectedCategory('')
    navigate("/dashboard/posts")
  }

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
    <Container className="py-4 h-100">
      <div className='px-4 pt-3 pb-4 rounded-4 shadow'>
        <h2>{postId ? 'Edit Post' : 'Add New Post'}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>

          <div className="row">
            <div className="col-12 col-md-8">
              <Form.Group controlId="formBasicTitle" className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </div>

            <div className="col-12 col-md-4">
              <Form.Group controlId="formBasicCategories" className="mt-3">
                <Form.Select id="exampleSelect" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="" disabled>Select an option</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <Form.Group controlId="formBasicContent" className="mt-3">
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
              style={{ height: 'auto', marginBottom: '20px' }}
            />
          </Form.Group>

          <div className='d-flex justify-content-end'>

            <Button onClick={previousPage} variant="secondary" type="submit" className="mt-3 px-5 mx-3 rounded-pill">
              Cancel
            </Button>

            <Button variant="primary" type="submit" className="mt-3 px-5 rounded-pill">
              {loading ? <Spinner animation="border" size="sm" /> : postId ? 'Update Post' : 'Add Post'}
            </Button>
          </div>

        </Form>
      </div >

    </Container >
  );
};

export default NewPost;