import React, { useRef, useEffect } from "react";
import { UserCard } from "./UserCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
export const ModalAddMessage = ({ setOpenModal }) => {
  //   const modalRef = useRef(null);
  //  Xử lý sự kiện khi bấm ra ngoài modal
  // useEffect(() => {
  //     function handleClickOutside(event) {
  //         if (modalRef.current && !modalRef.current.contains(event.target)) {
  //             setOpenModal(false);
  //         }
  //     }
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //         document.removeEventListener("mousedown", handleClickOutside);
  //     };
  // }, [modalRef]);
  const fetchData = [
    {
      id: 1,
      fullname: "Nguyễn Hoàng Phúc",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 2,
      fullname: "Nguyễn Hoàng Việt",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: "Nguyễn Hoàng Tuyển",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: "Huỳnh Ngọc Quí",
      username: "huynhngocqui",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: "Nguyễn Hoàng Tuyển",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: "Huỳnh Ngọc Quí",
      username: "huynhngocqui",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: "Nguyễn Hoàng Tuyển",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: "Huỳnh Ngọc Quí",
      username: "huynhngocqui",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: "Nguyễn Hoàng Tuyển",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: "Huỳnh Ngọc Quí",
      username: "huynhngocqui",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: "Nguyễn Hoàng Tuyển",
      username: "hoangphuc_seiza",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: "Huỳnh Ngọc Quí",
      username: "huynhngocqui",
      avatar:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
  ];
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [indexActive, setIndexActive] = useState(-2);
  const [fillterdData, setFillterData] = useState(fetchData);
  const handleChangeInput = (e) => {
    const searchText = e.target.value;
    setIndexActive(-2)
    setSearch(searchText);
    const fillterdUsers = fetchData.filter((user) =>
    user.fullname.toLowerCase().includes(searchText.toLowerCase())
    );
    setFillterData(fillterdUsers)
  }
  const handleButton = () => {
    setOpenModal(false);
    dispatch({type: 'ADD_USER', payload: fillterdData[indexActive]})
  }
  return (
    <div className="modal-addmess">
      <div className="modal-addmess_content">
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
          <input type="text" placeholder="Tìm kiếm..." autoFocus onChange={handleChangeInput}   value={search} />
        </div>
        <div className="modal-addmess_message_chat_list">
          {fillterdData.map((user, index) => (
            <UserCard user={user} isInModal={true} indexActive={indexActive} setIndexActive={setIndexActive} index={index}/>
          ))}
        </div>
        <button className="modal-addmess_btn btn" onClick={handleButton} disabled = {indexActive !== -2  ? false : true}>
          Trò chuyện
        </button>
      </div>
    </div>
  );
};

export default ModalAddMessage;
