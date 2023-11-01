import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCard } from "./UserCard";
import ModalAddMessage from "./ModalAddMessage";
export const LeftSide = ({setOpenModal}) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const fetchData =[
    {
      id: 1,
      fullname: 'Nguyễn Hoàng Phúc',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 2,
      fullname: 'Nguyễn Hoàng Việt',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: 'Nguyễn Hoàng Tuyển',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: 'Huỳnh Ngọc Quí',
      username: 'huynhngocqui',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: 'Nguyễn Hoàng Tuyển',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: 'Huỳnh Ngọc Quí',
      username: 'huynhngocqui',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: 'Nguyễn Hoàng Tuyển',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: 'Huỳnh Ngọc Quí',
      username: 'huynhngocqui',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: 'Nguyễn Hoàng Tuyển',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: 'Huỳnh Ngọc Quí',
      username: 'huynhngocqui',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 3,
      fullname: 'Nguyễn Hoàng Tuyển',
      username: 'hoangphuc_seiza',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
    {
      id: 4,
      fullname: 'Huỳnh Ngọc Quí',
      username: 'huynhngocqui',
      avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    },
  ]
  return (
    <>
      <div className="message_header">
        <div className="message_header-swicthAccountandModal">
          <div className="message_header-namedropdown">
            <h2>_hoang.phuc.seiza_</h2>
            <i class="fa fa-angle-down" aria-hidden="true" ></i>
          </div>
          <div className="message_header-newchat">
            <i class="fa fa-pencil-square-o" aria-hidden="true" onClick={()=>setOpenModal(true)} ></i>
          </div>
        </div>
        <div className="message_header-request">
            <h3>Tin nhắn</h3>
            <h4>Tin nhắn chờ</h4>
        </div>
      </div>
      <div className="message_chat_list">
        {fetchData.map((user) => (
          <UserCard user= {user} hover/>
        ))}
      </div>

    </>
  );
};
export default LeftSide;
