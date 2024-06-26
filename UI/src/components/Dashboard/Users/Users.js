import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { deleteUser, getUsers } from '../../Store/userSlice';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import ConfirmationDialog from '../../Dialog/ConfirmationDialog';

const Users = () => {

    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.userData) ?? [];
    const [open, setOpen] = React.useState(false);
    const [removeID, setRemoveID] = React.useState(null);
    const success = useSelector((state) => state.user.success);
    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);
    const UsersPerPage = 10;
    const indexOfLast = currentPage * UsersPerPage;
    const indexOfFirst = indexOfLast - UsersPerPage;
    const currentUsers = userData.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const pageNumbers = [];
        const totalPages = Math.ceil(userData.length / UsersPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => paginate(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="d-flex justify-content-end">
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                />
                {pageNumbers}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                />
            </Pagination>
        );
    };

    const handleDelete = async (postId) => {

        setOpen(true);
        setRemoveID(postId);

    };

    const handleClose = (newValue) => {
        setOpen(false);
        if (newValue) {
            dispatch(deleteUser(removeID));
        }
    };

    useEffect(() => {
        if (success) {
            alert("Post Deleted Successfully")
        }
    }, [success]);

    return (
        <div className="my-4 mx-3 h-auto">

            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Username</th>
                        <th scope="col">Role</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr>
                            <td>{user.firstName + ' ' + user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <div>
                                    <Link
                                        to={`/dashboard/users/${user._id}`}
                                        className="mx-3">
                                        <FaEdit size={20} className="text-primary" />
                                    </Link>
                                    <FaTrash
                                        size={20}
                                        className="text-danger"
                                        onClick={() => handleDelete(user._id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <ConfirmationDialog
                open={open}
                text="Are You Sure You Want to Delete this user?"
                onClose={handleClose}
            />
            {renderPagination()}
        </div>
    );
};

export default Users;