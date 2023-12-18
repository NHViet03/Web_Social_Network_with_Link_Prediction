import React, {useState} from "react";
import  UserCard  from "../UserCard";
import { useSelector ,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getDataAPI} from "../../utils/fetchData"
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { addUser } from "../../redux/actions/messageAction";
import loading from "../../images/loading.gif"
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
    const res = await getDataAPI(`search?username=${search}`, auth.token);
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
    dispatch(addUser({user,message}))
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
      <div className="modal-addmess_content" onClick={handleSearch}>
        <div className="modal-addmess_header">
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
          load && 
          <div className=" loading_modalAddMessage">
            <img className="loading" src={loading} alt="loading" />
          </div>
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
            <h6 className="my-3 mx-3 flex">Không có người dùng phù hợp</h6>
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
