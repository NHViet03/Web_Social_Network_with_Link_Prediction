import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import UserCard from "../UserCard";
import { useParams, useNavigate } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload, videoUpload } from "../../utils//imageUpload";
import Swal from "sweetalert2";

import {
  loadMoreMessages,
  deleteConversation,
  addMessage,
  getMessages,
  acceptConversation,
  MESS_TYPES,
  editMessage,
} from "../../redux/actions/messageAction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CallModal from "./CallModal";
import Loading from "../Loading";
import { checkMapTrue, generateObjectId } from "../../utils/helper";
import ModalManageGroup from "./ModalManageGroup";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";

const RightSide = () => {
  const { auth, message, theme, socket, call, peer } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const refDisplay = useRef();
  const pageEnd = useRef();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [textEdit, setTextEdit] = useState("");
  const [data1, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(9);
  const [isLoadMore, setIsLoadMore] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  const [isWaitingBox, setIsWaitingBox] = useState(false);
  const [isListenCLoseMsgDisplay, setIsListenCLoseMsgDisplay] = useState(false);

  // ====================== UseEffect ========================
  // Lấy tin nhắn đang được chỉnh sửa
  useEffect(() => {
    if (message.editMessage) {
      setTextEdit(message.editMessage.text);
    }
  }, [message.editMessage]);
  // Lấy tin nhắn của đoạn hội thoại hiện tại từ redux và hiển thị
  useEffect(() => {
    const newData = message?.data?.find((item) => item._id === id);

    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
    setIsLoadingMessages(false);
    // Kiểm tra phải tin nhắn chờ hay không
    const user = message?.users.find((user) => user._id === id);
    if (!user) return;
    const checkRecipientAccept = checkMapTrue(
      auth.user._id,
      user?.recipientAccept
    );
    setIsWaitingBox(!checkRecipientAccept);
  }, [message.data, id]);

  //  Lấy thông tin user đang nhắn tin + cuộn xuống cuối
  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        if (refDisplay.current) {
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 50);
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [id, message.users]);

  // Lấy dữ liệu tin nhắn từ backend nếu chưa có
  useEffect(() => {
    // Chờ cho tới khi danh sách users đã load xong
    if (!message.users || message.users.length === 0) return;

    // Tìm conversation của user hiện tại
    const conversation = message.users.find((user) => user._id === id);
    if (!conversation) return; // Không tìm thấy thì cũng dừng

    // Nếu chưa có message cho cuộc trò chuyện này thì load
    if (message.data.every((item) => item._id !== id)) {
      setIsLoadingMessages(true);
      setData([]);
      dispatch(getMessages({ auth, id, conversation }));

      // Cuộn xuống cuối sau khi dispatch (đợi khung DOM đã vẽ xong một nhịp)
      setTimeout(() => {
        refDisplay.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
    }
  }, [message.users, message.data, id, auth, dispatch]); // thêm message.users vào deps

  // Theo dõi pageEnd để kích hoạt “load more” khi người dùng scroll lên
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  // Khi isLoadMore thay đổi, gọi API tải thêm tin nhắn nếu đủ điều kiện
  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
  }, [isLoadMore]);

  // Tự động cuộn xuống khi người dùng gõ chữ
  useEffect(() => {
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [text]);

  // Nếu id không có trong danh sách users, navigate về trang message. Nhưng phải đợi message.users đã load xong
  // Điều này tránh lỗi khi người dùng truy cập trực tiếp vào một cuộc trò chuyện không hợp lệ
  useEffect(() => {
    if (!message.users || message.users.length === 0) return;
    const conversationExists = message.users.some((user) => user._id === id);
    if (!conversationExists) {
      navigate("/message");
    }
  }, [message.users, id, navigate]);

  //============================ Function ========================

  const handleMangeGroup = () => {
    dispatch({
      type: MESS_TYPES.MODAL_MANAGE_GROUP,
      payload: true,
    });
  };
  const handleAcceptWaitingBox = () => {
    const recipientID = id.split(".");
    dispatch(acceptConversation({ auth, listID: recipientID, id: id }));
    setIsWaitingBox(false);
    navigate("/message");
  };

  const haneleClickChatInput = () => {
    // Read message action
    dispatch({
      type: MESS_TYPES.READMESSAGE,
      payload: {
        id: user._id,
        userId: auth.user._id,
      },
    });
    try {
      //Save to DB read message = true
      const listID = id.split(".");
      postDataAPI(`readMessage/${auth.user._id}`, { listID }, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

  const handleEditMessage = async (msg, textEdit) => {
    if (!textEdit.trim()) return;
    msg = {
      ...msg,
      conversation: {
        _id: msg?.conversationID ?? msg?.conversation?._id,
        isGroup: msg?.isGroup ?? msg?.conversation?.isGroup,
        idPath: id,
      },
    };
    dispatch(editMessage({ auth, msg, textEdit, socket }));
  };

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb");
      }
      return newMedia.push(file);
    });
    if (err) dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err } });
    setMedia([...media, ...newMedia]);
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && media.length === 0) return;
    setText("");
    setMedia([]);
    setLoadMedia(true);
    setIsWaitingBox(false);
    //if (media.length > 0) newArr = await imageUpload(media);
    let newArr = [];
    if (media.length > 0) {
      const images = media.filter((item) => item.type.match(/image/i));
      const videos = media.filter((item) => item.type.match(/video/i));

      if (videos.length > 0) {
        const video = await videoUpload(videos);
        newArr.push(...video);
      }
      if (images.length > 0) {
        const img = await imageUpload(images);
        newArr.push(...img);
      }
    }
    let listId = id.split(".");
    if (user.isGroup) {
      listId = [...user.recipients.map((item) => item._id)];
    }
    if (!listId.includes(auth.user._id)) {
      listId.push(auth.user._id);
    }

    const msg = {
      recipients: [...listId],
      isRevoke: false,
      isEdit: false,
      isVisible: {},
      media: [...newArr],
      _id: generateObjectId(),
      isGroup: user.isGroup ? user.isGroup : false,
      conversationID: id,
      sender: {
        _id: auth.user._id,
        avatar: auth.user.avatar,
        fullname: auth.user.fullname,
        username: auth.user.username,
      },
      text: text,
      replymessage: message.replyMessage ? message.replyMessage : null,
      createAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("msg", msg);
    dispatch(addMessage({ msg, auth, socket }));

    setLoadMedia(false);
    refDisplay.current &&
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    dispatch({
      type: MESS_TYPES.REPLY_MESSAGE,
      payload: null,
    });
  };
  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
  };
  const handleDeleteConversation = (user) => () => {
    Swal.fire({
      title: "Xóa cuộc trò chuyện?",
      text: `Bạn có muốn xóa cuộc trò chuyện với ${user.fullname}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D97B5C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Chắc chắn!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Gọi API hoặc logic xóa ở đây
        Swal.fire({
          title: "Thành công!",
          text: "Cuộc trò chuyện đã được xóa",
          icon: "success",
        });
        dispatch(deleteConversation({ auth, id }));
        return navigate("/message");
      }
    });
  };
  // Call
  const caller = ({ video }) => {
    const { _id, avatar, fullname } = user;
    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      fullname,
      video,
    };
    dispatch({ type: GLOBAL_TYPES.CALL, payload: msg });
  };
  const callUser = ({ video }) => {
    const { _id, avatar, username, fullname } = auth.user;

    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      username,
      fullname,
      avatarRecipient: user.avatar,
      usernameRecipient: user.username,
      fullnameRecipient: user.fullname,
      video,
    };
    if (peer.open) msg.peerId = peer._id;
    socket.emit("callUser", msg);
  };
  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };
  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  // ====================== Render UI ========================

  return (
    <div className="conversation-message">
      <div
        className="conversation-message_header"
        style={{ position: "relative" }}
      >
        <UserCard user={user} headerMessage />
        <div className="conversation-message_header-icon">
          {user?.isGroup && user.isGroup == true ? (
            <>
              {/* <i
                class="fa-solid fa-trash"
                onClick={handleDeleteConversation(user)}
              ></i> */}
              <i
                class="fa-solid fa-circle-info"
                onClick={() => handleMangeGroup()}
              ></i>
              {message.modalManageGroup && <ModalManageGroup />}
            </>
          ) : (
            <>
              <i class="fa-solid fa-phone" onClick={handleAudioCall}></i>
              <i class="fa-solid fa-video" onClick={handleVideoCall}></i>
              <i
                class="fa-solid fa-trash"
                onClick={handleDeleteConversation(user)}
              ></i>
            </>
          )}
        </div>
        {isWaitingBox && (
          <div
            className="d-flex flex-direction-row justify-content-between align-items-center"
            style={{
              border: "1px solid #ffdfd5",
              borderRadius: "15px",
              backgroundColor: "#ffdfd5",
              position: "absolute",
              top: "105%",
              left: "0",
              right: "0",
              zIndex: "10",
              padding: "10px",
              margin: "0 50px",
            }}
          >
            <div className="btn btn-success" onClick={handleAcceptWaitingBox}>
              Chấp nhận
            </div>
            <div
              className="btn btn-warning"
              onClick={handleDeleteConversation(user)}
            >
              Xóa tin nhắn
            </div>
            {/* <div className="btn btn-danger">Chặn</div> */}
          </div>
        )}
      </div>

      <div
        className="conversation-message_chat-container"
        onClick={() => setIsListenCLoseMsgDisplay(!isListenCLoseMsgDisplay)}
      >
        <div className="conversation-message_chat-display" ref={refDisplay}>
          <button
            type="button"
            className="btn btn-warning"
            style={{ opacity: "0" }}
            ref={pageEnd}
          >
            Load More
          </button>
          {/* Thẻ div ở giữa: Đang tải đoạn chat... */}
          {isLoadingMessages && (
            <div
              className="conversation-message_chat_row"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                className="loading-conversation"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Loading />
                <div>Đang tải đoạn chat...</div>
              </div>
            </div>
          )}

          {!isLoadingMessages &&
            data1.map((msg, index) => (
              <div key={index}>
                {msg.sender._id !== auth.user._id && (
                  <div
                    className="conversation-message_chat_row other_message"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MsgDisplay
                      user={user}
                      msg={msg}
                      theme={theme}
                      yourmessage={false}
                      isListenCLoseMsgDisplay={isListenCLoseMsgDisplay}
                    />
                  </div>
                )}
                {msg.sender._id === auth.user._id && (
                  <div
                    className="conversation-message_chat_row your-message"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MsgDisplay
                      user={auth.user}
                      msg={msg}
                      theme={theme}
                      yourmessage={true}
                      isListenCLoseMsgDisplay={isListenCLoseMsgDisplay}
                    />
                  </div>
                )}
              </div>
            ))}
          <div className="show_media">
            {media.map((item, index) => (
              <div key={index} id="file_media">
                {item.type.match(/video/i)
                  ? videoShow(URL.createObjectURL(item), theme)
                  : imageShow(URL.createObjectURL(item), theme)}
                <span onClick={() => handleDeleteMedia(index)}>&times;</span>
              </div>
            ))}
          </div>
          {loadMedia && (
            <div className="conversation-message_chat_row your-message">
              <Loading />
            </div>
          )}
        </div>
      </div>

      {isWaitingBox && (
        <form
          className="conversation-message_chat-input"
          style={{ padding: "20px", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "rgb(120 120 120)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Bạn phải chấp nhận tin nhắn mới có thể nhắn tin
          </div>
        </form>
      )}
      {!isWaitingBox && (
        <form
          className="conversation-message_chat-input"
          onSubmit={handleSubmit}
        >
          {message.replyMessage && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "10",
                backgroundColor: "#D97B5C",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                transform: "translateY(-50px)",
                margin: "0 10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>{message.replyMessage.text}</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch({
                    type: MESS_TYPES.REPLY_MESSAGE,
                    payload: null,
                  });
                }}
              >
                x
              </div>
            </div>
          )}
          {message.editMessage && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "10",
                backgroundColor: "#D97B5C",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                transform: "translateY(-90px)",
                margin: "0 10px",
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                <div>Chỉnh sửa tin nhắn</div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch({
                      type: MESS_TYPES.EDIT_MESSAGE,
                      payload: null,
                    });
                  }}
                >
                  x
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: theme.text,
                }}
              >
                <input
                  type="text"
                  value={textEdit}
                  onChange={(e) => setTextEdit(e.target.value)}
                  //Enter
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditMessage(message.editMessage, textEdit);
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#fff",
                    color: "black",
                  }}
                />
                <div>
                  <i
                    onClick={() =>
                      handleEditMessage(message.editMessage, textEdit)
                    }
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#e2ef36",
                      hover: "red",
                    }}
                    class="fa-solid fa-circle-check"
                  ></i>
                </div>
              </div>
            </div>
          )}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClick={haneleClickChatInput}
            placeholder="Nhập tin nhắn..."
          />
          <div className="conversation-message_chat-input-btn ">
            <i
              className="fa-regular fa-face-grin"
              onClick={() => setShowEmoji(!showEmoji)}
            />
            {showEmoji && (
              <div className="form-emoji-picker_mess">
                <Picker
                  data={data}
                  previewPosition="none"
                  searchPosition="none"
                  theme="light"
                  set="native"
                  locale="vi"
                  perLine="7"
                  maxFrequentRows={14}
                  emojiSize={28}
                  navPosition="bottom"
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}
            <div className="file_upload">
              <i class="fa-regular fa-image"></i>
              <input
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*, video/*"
                onChange={handleChangeMedia}
              />
            </div>

            <button className="button_submit_mess" type="Submit">
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RightSide;
