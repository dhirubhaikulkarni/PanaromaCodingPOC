import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
      if (response.data.error) {
        setError(response.data.error.message);
      } else {
        console.log("set user");
        localStorage.setItem('user', JSON.stringify(response.data));
        //dispatch(SetUser(response.data));
        setError(null);
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Login failed, please try again');
    }
  };

  return (
    <Container className="h-100 mt-5">
      <div className="d-flex justify-content-center h-auto">
        <Col className="bg-primary-subtle p-4 rounded-4 shadow" xs={12} sm={9} md={6} lg={5} xl={4}>
          <div className='bg-primary w-100 rounded-4'>
            <img className='w-100 rounded-4' height={100} src='https://th.bing.com/th/id/OIP.iSkNM8_KRUfzBnFuHxmDPgHaBf?rs=1&pid=ImgDetMain'>
            </img>
          </div>
          <h2 className='w-100 mt-3 text-center'>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className='mt-3'>
            <Form.Group controlId="formBasicEmail">
              <Form.Control className='rounded-pill'
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Control className='rounded-pill'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button variant="primary" type="submit" className="mt-3 px-5 rounded-pill">
                Login
              </Button>
            </div>
            <hr className='w-100'></hr>
            <a className='d-flex justify-content-center mt-2' href='#'>
              Forgot password?
            </a>

            <div className='d-flex justify-content-center'>
              <a href='/signup'>
                <Button variant="primary" className="mt-3 px-5 rounded-pill">
                  Create an account
                </Button>
              </a>
            </div>

          </Form>
        </Col>
      </div>
    </Container>
  );
};

export default Login;
