import React, {useState} from "react";
import LeftSide from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";
import ModalAddMessage from "../../components/message/ModalAddMessage";
const Conversation = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="message d-flex px-0">
      <div className="message_left-side col-md-3 px-0">
        <LeftSide setOpenModal={setOpenModal}/>
      </div>
      <div className="message_right-side col-md-9 px-0 ">
        <RightSide/>
      </div>
      {openModal && <ModalAddMessage setOpenModal={setOpenModal} />}
    </div>
  );
};

export default Conversation;
