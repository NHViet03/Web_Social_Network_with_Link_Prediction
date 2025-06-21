import React, { useState, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../components/Loading";
import { getDataAPI } from "../utils/fetchData";
import GalleryPost from "../components/GalleryPost";

const Hashtags = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { auth } = useSelector((state) => ({
    auth: state.auth,
  }));

  const { id } = useParams();
  const pageEnd = useRef();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await getDataAPI(
          `explore_posts/hashtag/${id}?limit=${page * 10}`,
          auth?.token
        );

        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [id, auth?.token, page]);

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

  return (
    <div>
      <div>
        <div
          style={{
            paddingLeft: "130px",
            paddingRight: "130px",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <h4
            className="mb-0"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              lineHeight: "30px",
              color:"rgb(65, 80, 247)"
            }}
          >
            #{id}
          </h4>
          <span style={{
            fontSize: "14px",

          }}>Có {posts.length} bài viết</span>
        </div>

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
    </div>
  );
};

export default Hashtags;
