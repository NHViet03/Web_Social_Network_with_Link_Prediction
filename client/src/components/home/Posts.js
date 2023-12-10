import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CardBody from "../postCard/CardBody";
import CardHeader from "../postCard/CardHeader";
import CardFooter from "../postCard/CardFooter";
import Loading from "../Loading";

const Posts = () => {
  const homePosts = useSelector((state) => state.homePosts);
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    setPosts(homePosts.posts);
  }, [homePosts]);

  return (
    <div className="home-posts">
      {!homePosts.firstLoad && <Loading />}

      {!posts.length && (
        <div className="text-center home-posts-empty">
          Không có bài viết nào
        </div>
      )}

      {posts &&
        posts.map((post, index) => (
          <div className="mb-3 home-post-item" key={index}>
            <CardHeader user={post.user} post={post} />
            <CardBody post={post} />
            <CardFooter post={post} />
          </div>
        ))}
    </div>
  );
};

export default Posts;
