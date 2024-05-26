import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { registerUser, setError, setLoading } from '../Store/loginSlice';
import { useSelector, useDispatch } from 'react-redux';


const Signup = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const loading = useSelector((state) => state.login.loading);
  const error = useSelector((state) => state.login.error);
  const success = useSelector((state) => state.login.success);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    dispatch(registerUser(username,email,password,firstName,lastName))
  };

  return (
    <Container className="h-auto mt-5">
      <div className="d-flex justify-content-center pb-5">
        <Col className="bg-primary-subtle p-4 rounded-4 shadow" xs={12} sm={9} md={6} lg={5} xl={4}>
          <div className='bg-primary w-100 rounded-4'>
            <img className='w-100 rounded-4' height={100} src='https://th.bing.com/th/id/OIP.iSkNM8_KRUfzBnFuHxmDPgHaBf?rs=1&pid=ImgDetMain'>
            </img>
          </div>
          <h2 className='w-100 mt-3 text-center'>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success ? (
            <>
              <Alert variant="success">{success}</Alert>
              <p>Go to <Link to="/login">Login page</Link></p>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>

              <Form.Group controlId="formBasicFirstName" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicLastName" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicUsername" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword" className='mt-3'>
                <Form.Control className='rounded-pill'
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className="mt-3 px-5 rounded-pill">
                  {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                </Button>
              </div>

              <div className='d-flex justify-content-center mt-3'>
                <a href='/login' className='link-offset-2 link-underline link-underline-opacity-0'>
                  Already Have an account?
                </a>
              </div>

            </Form>
          )}
        </Col>
      </div>
    </Container>
  );
};

export default Signup;
