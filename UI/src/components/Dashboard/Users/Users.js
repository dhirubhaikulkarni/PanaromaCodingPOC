import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { getUsers } from '../../Store/userSlice';


const Users = () => {

    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    console.log(userData);

    return (
        <Container className="py-4 h-100">
            This is User list

        </Container>
    );
};

export default Users;