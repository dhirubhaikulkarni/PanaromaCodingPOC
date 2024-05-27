import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, updateUser } from '../../Store/userSlice';

const UserEdit = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state.user.userData);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!userData.length) {
      dispatch(getUsers());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData.length) {
      const selectedUser = userData.find(u => u._id === userId);
      if (selectedUser) {
        setUser(selectedUser);
        setFirstName(selectedUser.firstName);
        setLastName(selectedUser.lastName);
        setRole(selectedUser.role);
      }
    }
  }, [userData, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { _id: userId, firstName, lastName, role };
    dispatch(updateUser(updatedUser));
    navigate('/dashboard/users')
  };

  if (!user) return <Spinner animation="border" />;

  function previousPage() {
    setUser('')
    setFirstName('')
    setLastName('')
    setRole('')
    navigate('/dashboard/users')
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Edit User</h2>
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                readOnly
                disabled
              />
            </Form.Group>

            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="author">Author</option>
              </Form.Select>
            </Form.Group>
            <Button onClick={previousPage} variant="secondary" type="button" className="mt-3 px-5 mx-3 rounded-pill">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="mt-3 px-5 mx-3 rounded-pill">
              Update User
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserEdit;
