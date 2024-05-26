import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { checkValueEmptyOrNull } from '../../Utils/utils';

const PostDetails = (props) => {
  const { id } = useParams();
  const posts = useSelector((state) => state.post.data);
  const post = posts.find((p) => p._id === id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <div className="leading-tight whitespace-pre-wrap" dangerouslySetInnerHTML={{
        __html: post.content.substr(0, 100).replace(
          /(<? *script)/gi,
          "illegalscript"
        ),
      }}></div>
        <p>Author: {checkValueEmptyOrNull(post.authorName)}</p>
        <p>Category: {checkValueEmptyOrNull(post.categoryName)}</p>
      </div>
      );
};

      export default PostDetails;