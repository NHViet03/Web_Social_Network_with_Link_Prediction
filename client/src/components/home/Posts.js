import React, { useState, useEffect, useRef } from "react";
import CardBody from "../postCard/CardBody";
import CardHeader from "../postCard/CardHeader";
import CardFooter from "../postCard/CardFooter";
import Loading from "../Loading";

import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../redux/actions/postAction";

const Posts = () => {
  const homePosts = useSelector((state) => state.homePosts);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageEnd = useRef();

  useEffect(() => {
    setPosts(homePosts.posts);
  }, [homePosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, []);

  useEffect(() => {
    const getHomePosts = async () => {
      if (homePosts.result < page * 5 && page > 1) {
        setLoading(true);
        await dispatch(getPosts({ auth, page }));
        setLoading(false);
      }
    };

    getHomePosts();
  }, [auth, dispatch, homePosts.result, page]);

  return (
    <div className="home-posts">
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

      {(!homePosts.firstLoad || loading) && <Loading />}

      <button
        className="btn w-100 mt-5"
        ref={pageEnd}
        style={{
          opacity: 0,
        }}
      >
        Tải thêm
      </button>
    </div>
  );
};

export default Posts;
