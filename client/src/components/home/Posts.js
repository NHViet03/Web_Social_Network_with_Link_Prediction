import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CardBody from "../postCard/CardBody";
import CardHeader from "../postCard/CardHeader";
import CardFooter from "../postCard/CardFooter";


const Posts = () => {
  const {homePosts}=useSelector(state=>state)
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fake API
    setPosts(homePosts.posts);
  }, [homePosts]);

  return (
    <div className="home-posts">
      {posts &&
        posts.map((post, index) => (
          <div className="mb-3 home-post-item" key={index}>
            <CardHeader user={post.user} />
            <CardBody post={post} />
            <CardFooter post={post} />
          </div>
        ))}
    </div>
  );
};

export default Posts;
