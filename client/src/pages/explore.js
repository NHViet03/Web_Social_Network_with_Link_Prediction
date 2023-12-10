import React, { useState, useEffect, useRef } from "react";
import GalleryPost from "../components/GalleryPost";
import Loading from "../components/Loading";

import { useSelector, useDispatch } from "react-redux";
import { getDiscoverPosts } from "../redux/actions/exploreAction";

const Explore = () => {
  const { auth, explore } = useSelector((state) => ({
    explore: state.explore,
    auth: state.auth,
  }));
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const pageEnd = useRef();

  useEffect(() => {
    const getPosts = async () => {
      if (auth.token && !explore.firstLoad) {
        setLoading(false);
        dispatch(getDiscoverPosts({ auth }));
        setLoading(true);
      }
    };
    getPosts();
  }, [auth, dispatch, explore.firstLoad]);

  useEffect(() => {
    setPosts(explore.posts);
  }, [explore.posts]);

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
    const getPosts = async () => {
      if (explore.result < page * 10 && page > 1) {
        setLoading(true);
        await dispatch(getDiscoverPosts({ auth, page }));
        setLoading(false);
      }
    };
    getPosts();
  },[auth, dispatch, explore.result, page]);


  return (
    <div className="explore_container">
      <GalleryPost posts={posts} />
      {loading && <Loading />}
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

export default Explore;
