import React from "react";
import  LeftSide  from "../../components/message/LeftSide";
import { useState } from "react";
import ModalAddMessage from "../../components/message/ModalAddMessage";
import ModalAddMessageGroup from "../../components/message/ModalAddMessageGroup";
const Message = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalGroup, setOpenModalGroup] = useState(false);
  return (
    <div className="message d-flex px-0">
      <div className="message_left-side col-md-3 px-0">
        <LeftSide
          setOpenModal={setOpenModal}
          setOpenModalGroup={setOpenModalGroup}
        />
      </div>
      <div className="message_right-side col-md-9 px-0 ">
        <div
          className="d-flex justify-content-center 
        align-items-center flex-column h-100"
        >
          <i
            className="message_mes-fb fab fa-facebook-messenger text-primary"
            style={{ fontSize: "5rem" }}
          ></i>
          <h4>Tin nhắn của bạn</h4>
          <h5 className="message_right-side-h5">
            Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm
          </h5>
          <button
            className="message_right-side-btn"
            onClick={() => setOpenModal(true)}
          >
            Gửi tin nhắn
          </button>
        </div>
      </div>
      {openModal && <ModalAddMessage setOpenModal={setOpenModal} />}
      {openModalGroup && (
        <ModalAddMessageGroup setOpenModalGroup={setOpenModalGroup} />
      )}
    </div>
  );
};

export default Message;
