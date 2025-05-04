import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import Loading from "./Loading";

import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../utils/fetchData";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import {
  updateSearchHistory,
  deleteSearchHistory,
  deleteAllSearchHistory,
} from "../redux/actions/searchHistoryAction";

function SearchModal({ isShowSearch, setIsShowSearch }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { auth, searchHistory } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (search.length === 0) {
      setResults(searchHistory.searchHistories);
    }
  }, [searchHistory, search]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (keyword) => {
    try {
      setLoading(true);

      const type = keyword.startsWith("#") ? "hashtag" : "user";

      const res = await getDataAPI(
        `search?keyword=${keyword.replace("#", "")}&type=${type}`,
        auth.token
      );

      setResults(res.data.results);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    } finally {
      setLoading(false);
    }
  };

  const debounceHandleSearchHashtags = debounce(handleSearch, 500);

  const handleChangeSearchInput = (e) => {
    const value = e.target.value.toLowerCase().replace(/ /g, " ");

    setSearch(value);

    if (value.length > 0) {
      debounceHandleSearchHashtags(value);
    }
  };

  const handleChooseSearchResult = (result) => {
    setIsShowSearch(false);

    dispatch(updateSearchHistory({ result, token: auth.token }));
  };

  const handleDeleteSearchHistory = (e, id) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch(deleteSearchHistory({ id, token: auth.token }));
  };

  const handleDeleteAllSearchHistory = () => {
    dispatch(deleteAllSearchHistory({ token: auth.token }));
  };

  return (
    <div className={`sideBar_modal search_modal ${isShowSearch && "show"}`}>
      <h3>Tìm kiếm</h3>
      <div className="px-3 search_input">
        {search.length === 0 && (
          <i
            className="fa-solid fa-magnifying-glass search_icon"
            style={{ cursor: "pointer" }}
          />
        )}
        <input
          className="form-control"
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={handleChangeSearchInput}
        />

        {search.length > 0 && (
          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => setSearch("")}
          />
        )}
      </div>
      <div className="search_result">
        {search.length === 0 && (
          <div className="d-flex justify-content-between align-items-center mb-3 px-4">
            <h6 className="mb-0">Gần đây</h6>
            <span
              style={{
                fontSize: "14px",
                color: "var(--primary-color)",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={handleDeleteAllSearchHistory}
            >
              Xóa tất cả
            </span>
          </div>
        )}
        {loading && <Loading />}
        {results.map((result, index) =>
          result.type === "user" ? (
            <Link
              key={result._id}
              to={`/profile/${result._id}`}
              className="mb-2 search_result_card"
              onClick={() => handleChooseSearchResult(result)}
            >
              <UserCard
                user={{
                  _id: result._id,
                  username: result.title,
                  fullname: result.subtitle,
                  avatar: result.image,
                }}
                size="avatar-middle"
              />
              {search.length === 0 && (
                <i
                  className="fa-solid fa-xmark"
                  onClick={(e) => handleDeleteSearchHistory(e, result._id)}
                />
              )}
            </Link>
          ) : (
            <Link
              key={result._id}
              to={`/explore/hashtags/${result.title}`}
              className="mb-2 search_result_card"
              onClick={() => handleChooseSearchResult(result)}
            >
              <div className="d-flex align-items-center">
                <div
                  className="avatar-container avatar-middle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={result.image}
                    alt="#"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="userCard-content">
                  <h6 className="userCard-username">{result.title}</h6>

                  <small className="userCard-fullname">
                    {`${result.subtitle} bài viết`}
                  </small>
                </div>
              </div>

              {search.length === 0 && (
                <i
                  className="fa-solid fa-xmark"
                  onClick={(e) => handleDeleteSearchHistory(e, result._id)}
                />
              )}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default SearchModal;
