import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../utils/fetchData";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";

function SearchModal({ isShowSearch, setIsShowSearch }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { auth } = useSelector((state) => state);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if(search){
  //     if(search && auth.token){
  //      getDataAPI(`search?username=${search}`, auth.token)
  //       .then(res=> console.log(res))
  //       .catch(err=>{
  //         dispatch({ type: GLOBAL_TYPES.ALERT, payload:{error:err.response.data.msg}})
  //       })
  //     }
  //   }
  // },[search, auth.token, dispatch])

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  // const homePosts = useSelector((state) => state.homePosts);

  return (
    <form
      className={`sideBar_modal search_modal ${isShowSearch && "show"}`}
      onSubmit={handleSearch}
    >
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
          onChange={(e) =>
            setSearch(e.target.value.toLowerCase().replace(/ /g, " "))
          }
        />

        {search.length > 0 && (
          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => setSearch("")}
          />
        )}
      </div>
      <div className="search_result">
        <h6 className="mb-3">Gần đây</h6>
        {/* {homePosts.users.map((user, index) => (
          <div key={index} className="mb-2 search_result_card">
            <UserCard user={user} size="avatar-middle" />
            <i className="fa-solid fa-xmark" />
          </div>
        ))} */}
        {users.map((user, index) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="mb-2 search_result_card p-2"
            onClick={() => setIsShowSearch(false)}
          >
            <UserCard user={user} size="avatar-middle" />
            {/* <i className="fa-solid fa-xmark" /> */}
          </Link>
        ))}
      </div>
    </form>
  );
}

export default SearchModal;
