import React, { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import ExportCSV from "../../components/ExportCSV";
import PostList from "../../components/Post/PostList";
import Filter from "../../components/Post/Filter";

import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../redux/actions/postAction";
import { POST_TYPES } from "../../redux/actions/postAction";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    sort: "default",
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });

  const auth = useSelector((state) => state.auth);
  const postsData = useSelector((state) => state.postsData);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPostsData = async () => {
      if (postsData.firstLoad) return;
      await dispatch(
        getPosts({
          from: filter.date[0],
          to: filter.date[1],
          search,
          page: page - 1,
          auth,
        })
      );
    };

    getPostsData();
  }, [auth, dispatch, filter.date, page,postsData.firstLoad]);

  useEffect(() => {
    setFilter({ ...filter, sort: "default" });
    setPosts(postsData.posts);
  }, [postsData.posts]);

  const pages = useMemo(() => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(postsData.totalPosts / 10); i++) {
      pages.push(i);
    }
    return pages;
  }, [postsData.totalPosts]);

  const customData = useCallback(() => {
    return posts.map((post) => ({
      "Mã bài viết": post._id,
      "Lượt yêu thích": post.likes,
      "Lượt bình luận": post.comments,
      "Số lượng hình ảnh": post.images,
      "Ngày đăng": moment(post.createdAt).format("LLL"),
      "Thuộc về": post.user?.username,
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
        newPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date_oldest_to_newest":
        newPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        newPosts = [...postsData.posts];
    }
    setPosts(newPosts);
  }, [filter.sort]);

  useEffect(() => {
    window.location.hash = `?date_from=${moment(filter.date[0]).format(
      "l"
    )}&date_to=${moment(filter.date[1]).format("l")}&page=${page}`;
  }, [page, filter.date]);

  const handleSearch = async (e) => {
    e.preventDefault();
    window.location.hash = `?search=${search}&date_from=${moment(
      filter.date[0]
    ).format("l")}&date_to=${moment(filter.date[1]).format("l")}&page=${page}`;
    await dispatch(
      getPosts({ search, from: filter.date[0], to: filter.date[1], auth })
    );
    setPage(1);
  };

  const handleRefresh = () => {
    dispatch({
      type: POST_TYPES.FIRST_LOAD,
      payload: false,
    });
  };

  const handleChangePage = (value) => {
    if(value!==page){
      setPage(value);
      handleRefresh();
    }
  }

  return (
    <div className="mb-3 table">
      <div className="box_shadow mb-3 table_container">
        <div className="mb-3 ">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5>Danh sách Bài viết</h5>
            <div className="d-flex align-items-center">
              <form
                className="d-flex justify-content-between align-items-center table_search me-2"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="form-control me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i class="fa-solid fa-magnifying-glass" />
              </form>
              <div className="d-flex align-items-center me-4">
                <p className="fw-medium fs-6 me-1">Theo: </p>
                <select
                  class="form-select"
                  style={{
                    width: "fit-content",
                  }}
                >
                  <option value="username">Tên người dùng</option>
                </select>
              </div>
              <ExportCSV
                csvData={customData()}
                filename={"danh-sach-bai-viet"}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3 ">
            <Filter filter={filter} setFilter={setFilter} handleRefresh={handleRefresh}/>
          </div>
        </div>
        <div className="mb-3">
          <PostList posts={posts} />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center ">
        <p>
          Hiển thị {postsData.result === 0 ? 0 : 1 + (page - 1) * 10} đến{" "}
          {postsData.result + (page - 1) * 10} trong tổng số{" "}
          {postsData.totalPosts} bài viết
        </p>
        <div className="pagination">
          <button
            className="btn btn_page"
            disabled={page <= 1 && true}
            onClick={() => handleChangePage(page - 1)}
          >
            Trước
          </button>
          {pages.map((id) => (
            <button
              key={id}
              className={`btn btn_page ${id === page ? "active" : ""} `}
              onClick={() => handleChangePage(id)}
            >
              {id}
            </button>
          ))}
          <button
            className="btn btn_page"
            disabled={page >= pages.length && true}
            onClick={() => handleChangePage(page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default Posts;
