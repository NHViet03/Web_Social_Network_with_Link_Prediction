import React, { useState, useEffect } from "react";
import UserCard from "../UserCard";
import FollowButton from "../FollowButton"

import { useSelector, useDispatch } from "react-redux";
import { getSuggestedUsers } from "../../redux/actions/suggestAction";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const { auth, suggest } = useSelector((state) => ({
    auth: state.auth,
    suggest: state.suggest,
  }));
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getSuggestedUsers(auth.token));
  }, [auth.token, dispatch]);

  useEffect(()=>{
    if(suggest.users){
      setUsers(suggest.users)
    }
  },[suggest.users])

  return (
    <div className="col-4 suggestions">
      <UserCard user={auth.user} size="avatar-md" />
      <h6 className="my-4">Gợi ý cho bạn</h6>
      <div className="suggest-list">
        {users &&
          users.map((user, index) => (
            <UserCard key={index} user={user}> <FollowButton user={user}/></UserCard>
          ))
        }
      </div>
      <small
        style={{
          display: "block",
          marginTop: "24px",
          color: "#c7c7c7",
        }}
      >
        © 2023 DREAMERS FROM DREAMER TEAM
      </small>
    </div>
  );
};

export default Suggestions;
