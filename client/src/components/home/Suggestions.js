import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserCard from "../UserCard";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const { auth, homePosts } = useSelector((state) => ({
    auth: state.auth,
    homePosts: state.homePosts,
  }));

  useEffect(() => {
    setUsers(homePosts.users.slice(0, 5));
  }, []);
  return (
    <div className="col-4 suggestions">
      <UserCard
        user={auth}
        size="avatar-md"
      />
      <h6 className="my-4">Gợi ý cho bạn</h6>
      <div className="suggest-list">
        {users &&
          users.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              follow
            />
          ))}
      </div>
      <small style={{
        display:'block',
        marginTop:'24px',
        color:'#c7c7c7'
      }}>
      © 2023 DREAMERS FROM DREAMER TEAM
      </small>
    </div>
  );
};

export default Suggestions;
