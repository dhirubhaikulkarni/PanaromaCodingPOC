import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetPassword, setError, setLoading, setSuccess } from '../Store/loginSlice';


const ResetPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [previousPassword, setPreviousPassword] = useState('');

    const loading = useSelector((state) => state.login.loading);
    const error = useSelector((state) => state.login.error);
    const success = useSelector((state) => state.login.success);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        if (password !== confirmPassword) {
            dispatch(setError('Passwords do not match.'));
            dispatch(setLoading(false));
            const timer = setTimeout(() => {
                dispatch(setSuccess(null));
                dispatch(setError(null));
            }, 1000);
            // Clear timeout if the component is unmounted
            return () => clearTimeout(timer);
        }
        else {
            dispatch(resetPassword(email, password, previousPassword))
        }


    };

    return (
        <Container className="h-auto mt-5">
            <div className="d-flex justify-content-center pb-5">
                <Col className="bg-primary-subtle p-4 rounded-4 shadow" xs={12} sm={9} md={6} lg={5} xl={4}>
                    <div className='bg-primary w-100 rounded-4'>
                        <img className='w-100 rounded-4' height={100} src='https://th.bing.com/th/id/OIP.iSkNM8_KRUfzBnFuHxmDPgHaBf?rs=1&pid=ImgDetMain'>
                        </img>
                    </div>
                    <h2 className='w-100 mt-3 text-center'>Reset Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success ? (
                        <>
                            <Alert variant="success">{success}</Alert>
                            <p>Go to <Link to="/login">Login page</Link></p>
                        </>
                    ) : (
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="formBasicEmail" className='mt-3'>
                                <Form.Control className='rounded-pill'
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmPassword" className='mt-3'>
                                <Form.Control className='rounded-pill'
                                    type="password"
                                    placeholder="Previous Password"
                                    value={previousPassword}
                                    onChange={(e) => setPreviousPassword(e.target.value)}
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
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
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

export default ResetPassword;
