import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCard from "../UserCard"
import { useParams, useNavigate } from "react-router-dom";
import { MESS_TYPES, getConversations } from "../../redux/actions/messageAction";



export const LeftSide = ({setOpenModal}) => {
  const {auth, message, online} = useSelector(state => state)
  const {id} = useParams();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);
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
  
  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setPage(p => p + 1)
      }
    }, {
      threshold: 0.1
    })
    observer.observe(pageEnd.current)
  },[setPage])
  // Check User Online / Offline
  useEffect(() => {
    if(message.firstLoad) {
      dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
    }
  },[online, message.firstLoad, dispatch])
  useEffect(() => {
    if(message.resultUsers >= (page - 1) * 9 && page > 1){
      dispatch(getConversations({auth, page}));
    }
  },[message.resultUsers, page, auth, dispatch])
  return (
    <>
      <div className="message_header">
        <div className="message_header-swicthAccountandModal">
          <div className="message_header-namedropdown">
            <h2 onClick={()=> navigate('/message')}>{auth.user.username}</h2>
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
                <UserCard user={user} size ="avatar-middle">
                  {
                    user.online 
                    ? <i className="fa-solid fa-circle active"></i>
                    :  auth.user.following.find(item => item._id === user._id) && <i className="fa-solid fa-circle"></i>
                  }
                </UserCard>
               
            </div>
          )
          )}
          <button type="button" className="btn btn-warning" style={{opacity: '0'}} ref={pageEnd}>Load More</button>
        </div>
       }
      </div>

    </>
  );
};
export default LeftSide;
