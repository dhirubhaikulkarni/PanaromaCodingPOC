import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

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
      <p>{post.content}</p>
      <p>Author: {post.author}</p>
      <p>Category: {post.category}</p>
    </div>
  );
};

export default PostDetails;