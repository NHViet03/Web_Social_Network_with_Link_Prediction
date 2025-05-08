import React, {useState} from "react";
import LeftSide from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";
import ModalAddMessage from "../../components/message/ModalAddMessage";
import ModalAddMessageGroup from "../../components/message/ModalAddMessageGroup";
const Conversation = () => {
  const [openModal, setOpenModal] = useState(false);
    const [openModalGroup, setOpenModalGroup] = useState(false);
  return (
    <div className="message d-flex px-0">
      <div className="message_left-side col-md-3 px-0">
        <LeftSide setOpenModal={setOpenModal} setOpenModalGroup={setOpenModalGroup}/>
      </div>
      <div className="message_right-side col-md-9 px-0 ">
        <RightSide/>
      </div>
      {openModal && <ModalAddMessage setOpenModal={setOpenModal} />}
      {openModalGroup && (
        <ModalAddMessageGroup setOpenModalGroup={setOpenModalGroup} />
      )}
    </div>
  );
};

export default Conversation;
