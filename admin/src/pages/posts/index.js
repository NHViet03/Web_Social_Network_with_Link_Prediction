import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import ExportCSV from "../../components/ExportCSV";
import formatNumber from "../../utils/formatNumber";
import PostList from "../../components/Post/PostList";
import Filter from "../../components/Post/Filter";

const fakePosts = [
  {
    _id: "65697a6e8c234125384779fd",
    likes: 1200,
    comments: 60,
    images: 3,
    createdAt: new Date(2021, 5, 4),
    user: {
      username: "anle123",
      avatar:
        "https://res.cloudinary.com/dswg5in7u/image/upload/v1701768061/DreamerDB/kejzf2gig4h5ycfanwfp.jpg",
    },
  },
  {
    _id: "65697a6e8c234125384779ab",
    likes: 1100,
    comments: 40,
    images: 3,
    createdAt: new Date(2022, 5, 4),
    user: {
      username: "tucute123",
      avatar:
        "https://res.cloudinary.com/dswg5in7u/image/upload/v1701775180/DreamerDB/f4iwxihq1ha27dtdrexe.png",
    },
  },
  {
    _id: "65697a6e8c234125384779cd",
    likes: 1000,
    comments: 30,
    images: 3,
    createdAt: new Date(2023, 5, 4),
    user: {
      username: "nhviet03",
      avatar:
        "https://res.cloudinary.com/dswg5in7u/image/upload/v1701862207/DreamerDB/tffpbpkhsbeqsyzzivdl.jpg",
    },
  },
];

function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    sort: "default",
    status: "all",
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });

  const pages = [1, 2, 3, 4, 5];

  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < 3; i++) {
      newArr.push(...fakePosts);
    }
    setPosts(newArr);
  }, []);

  const customData = useCallback(() => {
    return posts.map((post) => ({
      "Mã bài viết": post._id,
      "Lượt yêu thích": post.likes,
      "Lượt bình luận": post.comments,
      "Số lượng hình ảnh": post.images,
      "Ngày đăng": moment(post.createdAt).format("LLL"),
      "Thuộc về": post.user.username,
    }));
  }, [posts]);

  useEffect(() => {
    if (posts.length === 0) return;
    let newPosts = [...posts];
    switch (filter.sort) {
      case "likes_high_to_low":
        newPosts.sort((a, b) => b.likes - a.likes);
        break;
      case "likes_low_to_high":
        newPosts.sort((a, b) => a.likes - b.likes);
        break;
      case "date_newest_to_oldest":
        newPosts.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "date_oldest_to_newest":
        newPosts.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default:
        let newArr = [];
        for (let i = 0; i < 3; i++) {
          newArr.push(...fakePosts);
          newPosts = newArr;
        }
    }
    setPosts(newPosts);
  }, [filter.sort]);

  return (
    <div className="mb-3 table">
      <div className="box_shadow mb-3 table_container">
        <div className="mb-3 ">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5>Danh sách Bài viết</h5>
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex justify-content-between align-items-center table_search">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="form-control me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i class="fa-solid fa-magnifying-glass" />
              </div>
              <ExportCSV
                csvData={customData()}
                filename={"danh-sach-bai-viet"}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3 ">
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <div className="mb-3">
          <PostList posts={posts} />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center ">
        <p>
          Hiển thị {1} đến {10} trong tổng số {50} bài viết
        </p>
        <div className="pagination">
          <button
            className="btn btn_page"
            disabled={page <= 1 && true}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </button>
          {pages.map((id) => (
            <button
              key={id}
              className={`btn btn_page ${id === page ? "active" : ""} `}
              onClick={() => setPage(id)}
            >
              {id}
            </button>
          ))}
          <button
            className="btn btn_page"
            disabled={page >= pages.length && true}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default Posts;
