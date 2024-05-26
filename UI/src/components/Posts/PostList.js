import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import { getPosts } from '../Store/postManagementSlice';
import { useDispatch, useSelector } from "react-redux";
import { checkValueEmptyOrNull } from '../../Utils/utils';

const PostList = (props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const posts = useSelector((state) => state.post.data);
  console.log(posts)
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
          <Col key={post._id} sm={12} md={6} lg={4} className="d-flex justify-content-around mb-4">
            <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
              <Card style={{ width: 'auto', height: '100%' }} className='border-0 shadow pe-auto'>
                <Card.Img variant="top" src="https://th.bing.com/th/id/OIP.au547IWsqSQUkUwyd7LHZAHaEK?rs=1&pid=ImgDetMain" />
                <Card.Body style={{ height: 'auto' }}>
                  <Card.Title>
                    {post.title}
                  </Card.Title>

                  <div class="col d-flex flex-column justify-content-between">

                    <div class="col align-self-start">
                      <div className="leading-tight whitespace-pre-wrap" dangerouslySetInnerHTML={{
                        __html: post.content.substr(0, 100).replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        )
                      }}>
                      </div>
                    </div>

                  </div>

                </Card.Body>

                <Card.Footer className='border-0 bg-transparent'>
                  <div class="col d-flex flex-column justify-content-between">

                    <div class="col align-self-end">
                      <cite title="Source Title" className='text-end blockquote-footer'>
                        Author: {checkValueEmptyOrNull(post.authorName)} | Category: {checkValueEmptyOrNull(post.categoryName)}
                      </cite>
                    </div>

                  </div>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {renderPagination()}
    </Container>
  );
};

export default PostList;