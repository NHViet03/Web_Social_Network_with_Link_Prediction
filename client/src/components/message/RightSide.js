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
} from "../../redux/actions/messageAction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CallModal from "./CallModal";
import Loading from "../Loading";

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
  const [data1, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(9);
  const [isLoadMore, setIsLoadMore] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  const [strangerModal, setStrangerModal] = useState(true);


   // UseEffect
  // Lấy tin nhắn của đoạn hội thoại hiện tại từ redux và hiển thị
  useEffect(() => {
    const newData = message?.data?.find((item) => item._id === id);

    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);

      const currentChat = message.users.find(
        (user) => user._id === newData._id
      );
      setStrangerModal(currentChat?.recipientAccept);
    }
  }, [message.data, id]);

  //  Lấy thông tin user đang nhắn tin + cuộn xuống cuối
  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [id, message.users]);

  // Lấy dữ liệu tin nhắn từ backend nếu chưa có
  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          if (refDisplay.current) {
            refDisplay.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        }, 50);
      }
    };
    getMessagesData();
  }, [dispatch, auth, id, message.data]);

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
  const handleAcceptWaitingBox = async () => {
    const recipientID = id;
    await dispatch(acceptConversation({ auth, id: recipientID }));
    setStrangerModal(true);
  };

  // Tự động cuộn xuống khi người dùng gõ chữ
  useEffect(() => {
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [text]);

  // Function

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
    const listId = id.split(".");

    const msg = {
      sender: auth.user._id,
      recipient: listId,
      text: text,
      media: newArr,
      CreatedAt: new Date().toISOString(),
    };
    dispatch(addMessage({ msg, auth, socket }));
    setLoadMedia(false);
    refDisplay.current &&
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
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
      video,
    };
    if (peer.open) msg.peerId = peer._id;

    socket.emit("callUser", msg);
  };
  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: true });
  };
  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <div className="conversation-message">
      <div
        className="conversation-message_header"
        style={{ position: "relative" }}
      >
        <UserCard user={user} headerMessage />
        <div className="conversation-message_header-icon">
          {user?.isGroup && user.isGroup == true ? (
                <i class="fa-solid fa-circle-info"></i>
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
        {strangerModal !== undefined && strangerModal === false && (
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
            <div className="btn btn-danger">Chặn</div>
          </div>
        )}
      </div>

      <div className="conversation-message_chat-container">
        {call && <CallModal />}
        <div className="conversation-message_chat-display" ref={refDisplay}>
          <button
            type="button"
            className="btn btn-warning"
            style={{ opacity: "0" }}
            ref={pageEnd}
          >
            Load More
          </button>
          {data1.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id && (
                <div className="conversation-message_chat_row other_message">
                  <MsgDisplay
                    user={user}
                    msg={msg}
                    theme={theme}
                    yourmessage={false}
                  />
                </div>
              )}
              {msg.sender === auth.user._id && (
                <div className="conversation-message_chat_row your-message">
                  <MsgDisplay
                    user={auth.user}
                    msg={msg}
                    theme={theme}
                    yourmessage={true}
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

      <form className="conversation-message_chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
    </div>
  );
};

export default RightSide;
