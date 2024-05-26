import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { checkValueEmptyOrNull } from '../../Utils/utils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';


const PostDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = useSelector((state) => state.post.data);
  
  const post = posts.find((p) => p._id === id);


  function homePage (){
    navigate("/")
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Container className="h-100 py-4">

      <div className='text-white d-flex justify-content-start border border-white '>
        <button onClick={homePage} className='btn btn-primary rounded-pill px-3'>Back</button>
      </div>

      <div>
        <h2>{post.title}</h2>
      </div>

      <div class="row">
        <div className='col-12 col-lg-9 d-flex justify-content-between'>
          <div>
            Published on {new Date(post.createdAt).toLocaleString()}
          </div>
          <div>
            Category: {checkValueEmptyOrNull(post.categoryName)}
          </div>
        </div>

        <div class="col-12 col-lg-9 my-4">
          <img className='w-100' style={{ height: 'auto' }} src="https://th.bing.com/th/id/OIP.au547IWsqSQUkUwyd7LHZAHaEK?rs=1&pid=ImgDetMain" />
        </div>

        <div class="col-12 col-lg-3 h-25 my-3">
          <div className='mb-2 fw-bold'>
            ABOUT THE AUTHOR
          </div>
          {
            post.authorName ?
              <div class="row rounded shadow">
                <div class="col-lg-4">
                  <div style={{ width: '75px', height: '75px' }} className='bg-primary rounded-pill m-3 d-flex justify-content-center align-items-center'>

                    <span className='text-center text-white fs-1 fw-bold align-middle text-nowrap'>
                      {post.authorName ? post.authorName.split(' ')[0][0] + '' + post.authorName.split(' ')[1][0] : ''}
                    </span>
                  </div>
                </div>

                <div class="col-lg-8 py-2">
                  <div className='d-flex justify-content-start fs-5'>
                    {post.authorName}
                  </div>
                </div>
              </div>
              :
              <div class="row rounded shadow py-4">
                <span>There is no author for this post</span>
              </div>
          }

        </div>
      </div>

      <div>
        <div className="leading-tight whitespace-pre-wrap" dangerouslySetInnerHTML={{
          __html: post.content.replace(
            /(<? *script)/gi,
            "illegalscript"
          ),
        }}>
        </div>
      </div>
    </Container>
  );
};

export default PostDetails;