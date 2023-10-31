import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserCard from "../UserCard";


const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const { auth,homePosts } = useSelector((state) => state);

  useEffect(() => {
    setUsers(homePosts.users.slice(0,5));
  }, []);
  return (
    <div className="col-4 suggestions">
      <UserCard
        avatar={auth.avatar}
        username={auth.username}
        fullname={auth.fullname}
        size="avatar-md"
      />
      <h6 className="my-4">Gợi ý cho bạn</h6>
      <div className="suggest-list">
        {users &&
          users.map((user,index)=>(
            <UserCard 
              key={index}
            avatar={user.avatar}
            username={user.username}
            fullname={user.fullname}
            follow
            />
          ))
        }
      </div>
    </div>
  );
};

export default Suggestions;
