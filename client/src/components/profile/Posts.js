import React, { useState, useEffect } from "react";
import PostThumb from "../PostThumb";
import NoPost from "../NoPost";

const Posts = ({ id, dispatch, profile }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);

  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setPosts(data.posts);
        setResult(data.result);
      }
    });
  }, [profile.posts, id]);
  return posts.length === 0 ? (
    <NoPost />
  ) : (
    <PostThumb posts={posts} result={result} />
  );
};

export default Posts;
