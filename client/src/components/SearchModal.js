import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserCard from "./UserCard";

function SearchModal() {
  const [search, setSearch] = useState("");
  const homePosts = useSelector((state) => state.homePosts);

  return (
    <div className="sideBar_modal search_modal">
      <h3>Tìm kiếm</h3>
      <div className="px-3 search_input">
        {search.length === 0 && (
          <i className="fa-solid fa-magnifying-glass search_icon" />
        )}
        <input
          className="form-control"
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.length > 0 && <i className="fa-solid fa-circle-xmark" onClick={()=>setSearch("")}/>}
      </div>
      <div className="search_result">
        <h6 className="mb-3">Gần đây</h6>
        {homePosts.users.map((user, index) => (
          <div key={index} className="mb-2 search_result_card">
            <UserCard user={user} size="avatar-middle" />
            <i className="fa-solid fa-xmark" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchModal;
