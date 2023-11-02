import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CardBody from "../postCard/CardBody";
import CardHeader from "../postCard/CardHeader";
import CardFooter from "../postCard/CardFooter";

const Posts = () => {
  const { homePosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    // Fake API
    setPosts(homePosts.posts);
  
  }, [homePosts]);

  useEffect(() => {
    setShowPosts(posts.slice(0, next > posts.length ? posts.length : next));
  }, [posts, next]);

  return (
    <div className="home-posts">
      {!showPosts.length && (
        <div className="text-center home-posts-empty">
          Không có bài viết nào
        </div>
      )}

      {showPosts &&
        showPosts.map((post, index) => (
          <div className="mb-3 home-post-item" key={index}>
            <CardHeader user={post.user} />
            <CardBody post={post} />
            <CardFooter post={post} />
          </div>
        ))}
      {next < posts.length && (
        <div className="home-posts-readMore" onClick={() => setNext(next + 10)}>
          <span>Xem thêm</span>
          <i className="fa-solid fa-angles-down" />
        </div>
      )}
    </div>
  );
};

export default Posts;
