import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import { getPosts } from '../Store/postManagementSlice';
import { useDispatch, useSelector } from "react-redux";

const PostList = (props) => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const posts = useSelector((state) => state.post.data);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // Number of posts per page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(posts.length / postsPerPage);

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
      <Pagination>
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

  return (
    <Container className="pt-4">
      <Row>
        {currentPosts.map((post) => (
          <Col key={post._id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <Link to={`/post/${post._id}`}>{post.title}</Link>
                </Card.Title>
                <Card.Text>{post.content.substr(0, 100)}...</Card.Text>
                <footer className="blockquote-footer">
                  <cite title="Source Title">
                    {/* Author: {post.author.username} | Category: {post.category.name} */}
                    Author: {post.author} | Category: {post.category}
                  </cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {renderPagination()}
    </Container>
  );
};

export default PostList;