import React from 'react';
import { Container } from 'react-bootstrap';
import useAuth from '../../Auth/useAuth';

const Profile = () => {
  const user = useAuth();
  if (!user) {
    return null;
  }

  return (
    <Container>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </Container>
  );
};

export default Profile;
