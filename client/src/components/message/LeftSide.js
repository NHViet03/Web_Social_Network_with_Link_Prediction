import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCard from "../UserCard"
import { useParams, useNavigate } from "react-router-dom";
import { getConversations } from "../../redux/actions/messageAction";



export const LeftSide = ({setOpenModal}) => {
  const {auth, message} = useSelector(state => state)
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const isActive = (user) =>{
    if(id === user._id) return "active"
    return ''
  }
  useEffect(() => {
    if(message.firstLoad) return;
    dispatch(getConversations({auth}));
  },[dispatch, message.firstLoad, auth])
  return (
    <>
      <div className="message_header">
        <div className="message_header-swicthAccountandModal">
          <div className="message_header-namedropdown">
            <h2>{auth.user.username}</h2>
            <i class="fa fa-angle-down" aria-hidden="true" ></i>
          </div>
          <div className="message_header-newchat">
            <i class="fa fa-pencil-square-o" aria-hidden="true" onClick={()=>setOpenModal(true)} ></i>
          </div>
        </div>
        <div className="message_header-request">
            <h3>Tin nhắn</h3>
            <h4></h4>
        </div>
      </div>
      <div className="message_chat_list">
       {
       <div className="message_chat_card"> 
          {message.users.map((user) => 
          (
            <div className={`message_user  ${isActive(user)}`} key={user._id} onClick={() => navigate(`/message/${user._id}`)}>
                <UserCard user={user} size ="avatar-middle" />
                <i class="fa-solid fa-circle"></i>
            </div>
          )
          )}
        </div>
       }
      </div>

    </>
  );
};
export default LeftSide;
