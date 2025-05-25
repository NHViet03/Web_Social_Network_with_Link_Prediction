import React, {useState} from "react";
import  UserCard  from "../UserCard";
import { useSelector ,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getDataAPI} from "../../utils/fetchData"
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { MESS_TYPES } from "../../redux/actions/messageAction";
import Loading from "../../components/Loading";
export const ModalAddMessage = ({ setOpenModal }) => {
  const navigate = useNavigate()
  const {auth, message} = useSelector((state) => state);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUser] = useState([])
  const [load, setLoad] = useState(false);
  const handleSearch = async (e) => {
   e.preventDefault();
   if (!search) return setSearchUser([]);
   try {
    setLoad(true);
    const res = await getDataAPI(`searchmessage?username=${search}&mesagechatbox=${auth.user._id}`, auth.token);
    setSearchUser(res.data.users);
    setLoad(false);
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
  }
  const handleAddUser = (user) => {
    const userData =
    {
      avatar : user.avatar,
      fullname: user.fullname,
      username: user.username,
      _id: user._id,
      text: '',
      media: [],
      isVisible: {
        [auth.user._id]: true,
        [user._id]: true
      },
      recipientAccept: {
        [auth.user._id]: true,
        [user._id]: true
      },
      isRead: {
        [auth.user._id]: true,
        [user._id]: true
      },
      isGroup: false,
      online: false,
    }
    dispatch({ type: MESS_TYPES.ADD_USER, payload: userData });
    navigate(`/message/${user._id}`)
    setOpenModal(false)
  }
  const handleEnter = (e) => {  
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };
  return (
    <div className="modal-addmess">
      <div className="modal-addmess_content">
        <div className="modal-addmess_header">
          <div></div>
          <h5 className="modal-addmess_content-h5">Tin nhắn mới</h5>
          <i
            class="fa fa-times"
            aria-hidden="true"
            onClick={() => setOpenModal(false)}
          ></i>
        </div>
        <div className="modal-addmess_content-search">
          <h5>Đến:</h5>
          <input type="text"
           placeholder="Tìm kiếm..."  
           onChange={e => setSearch(e.target.value)}   
           value={search} 
            onKeyPress={handleEnter}
           />
        </div>
        <div className="modal-addmess_message_chat_list">
        {
          load &&  <Loading />
          
        }
        {
          searchUsers.length !== 0 ? <>
            {
              searchUsers.map(user => (
                <div key={user._id} className="message_user mt-2" onClick={()=>handleAddUser(user)}>
                  <UserCard user={user} size ="avatar-middle" />
                </div>
              ))
            }
          </> : <>
            <h6 className="my-3 mx-3 flex"
             style={{ display: load ? 'none' : 'block' }}
            >Không có người dùng phù hợp</h6>
          </>
        }
        </div>
        {/* <button className="modal-addmess_btn btn" type="submit">
          Trò chuyện
        </button> */}
      </div>
    </div>
  );
};

export default ModalAddMessage;
