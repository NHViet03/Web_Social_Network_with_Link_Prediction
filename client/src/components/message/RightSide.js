import React, {useEffect, useState, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import UserCard from "../UserCard"
import { useParams } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils//imageUpload";
import { addMessage, getMessages } from "../../redux/actions/messageAction";
import data from '@emoji-mart/data'
import Picker from "@emoji-mart/react";
import loadIcon from "../../images/loading.gif"

const RightSide = () => {
  const {auth, message, theme, socket} = useSelector(state => state)
  const dispatch = useDispatch();
  const {id} = useParams();
  const refDisplay = useRef()
  const pageEnd = useRef()
  const [user, setUser] = useState([])
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [media, setMedia] = useState([])
  const [page, setPage] = useState(0)
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  useEffect(() => {
    const newData = message.data.filter(item => item.sender === auth.user._id || item.sender === id)
    setData(newData)
    setPage(1)
  },[ message.data, auth.user._id, id])

  useEffect(() => {
    if (id) {
      const newUser = message.users.find(user => user._id === id)
      if (newUser) {
        setUser(newUser)
      }
    }
  },[id, message.users])
  useEffect(() => {
    if(id) {
      const getMessagesData = async () => {
        
        await dispatch(getMessages({auth, id}))
        refDisplay.current && refDisplay.current.scrollIntoView({behavior: "smooth", block: "end"})
      }
      getMessagesData()
    }
  },[dispatch, auth, id])
  const handleChangeMedia = (e) => {
    const files = [...e.target.files]
    let err =""
    let newMedia = []

    files.forEach(file => {
      if(!file) return err ="File does not exist"
      if(file.size > 1024 * 1024 * 5){
        return err = "The image/video largest is 5mb"
      }
      return newMedia.push(file)
    })
    if(err) dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err}})
    setMedia([...media, ...newMedia])
    refDisplay.current && refDisplay.current.scrollIntoView({behavior: "smooth", block: "end"})
  }
  const handleDeleteMedia = (index) => {
    const newArr = [...media]
    newArr.splice(index, 1)
    setMedia(newArr)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!text.trim() && media.length === 0) return;
    setText("")
    setMedia([])
    setLoadMedia(true)

    let newArr = []
    if(media.length > 0) newArr = await imageUpload(media)
    
    const msg ={
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      CreatedAt: new Date().toISOString()
    }
    setLoadMedia(false)
    await dispatch(addMessage({msg, auth, socket}))  
    refDisplay.current && refDisplay.current.scrollIntoView({behavior: "smooth", block: "end"})
  }
  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
  };
  // Load more
  useEffect(() => 
  {
    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setPage(p => p + 1)
      }
    }, {
      threshold: 0.1
    })
    observer.observe(pageEnd.current)
  }, [setPage])

  useEffect(() => {
    if(message.resultUsers >= (page - 1) * 9 && page > 1){
      dispatch(getMessages({auth,id ,page}))
    }
  }, [message.resultUsers, page, auth, dispatch])
  useEffect(() => {
    if(refDisplay.current){
      refDisplay.current.scrollIntoView({behavior: "smooth", block: "end"})
    }
  }, [message.data])
  return (
    <div className="conversation-message">
      <div className="conversation-message_header">
          <UserCard user={user} headerMessage/>
        <div className="conversation-message_header-icon">
          <i class="fa-solid fa-phone"></i>
          <i class="fa-solid fa-video"></i>
          <i class="fa-solid fa-circle-info"></i>
        </div>
      </div>
      <div className="conversation-message_chat-container">
         <div className="conversation-message_chat-display" ref={refDisplay}>
            <button type="button" className="btn btn-warning" style={{opacity: '0'}} ref={pageEnd}>Load More</button>
            {
              data.map((msg, index) => (
                <div key={index}>

                {
                    msg.sender !== auth.user._id &&
                    <div className="conversation-message_chat_row other_message">
                      <MsgDisplay user={user} msg={msg} theme={theme} />
                    </div>
                  }
                  {
                    msg.sender === auth.user._id &&
                    <div className="conversation-message_chat_row your-message">
                      <MsgDisplay user={auth.user} msg={msg} theme={theme} />
                    </div>
                  }
                </div>
              ))
            }
        <div className="show_media">
            {
              media.map((item, index) => (
                <div key={index} id="file_media">
                  {
                    item.type.match(/video/i)
                    ? videoShow(URL.createObjectURL(item), theme)
                    : imageShow(URL.createObjectURL(item), theme)
                  }
                  <span onClick={()=> handleDeleteMedia(index)}>&times;</span>
                </div>
              ))
            }
        </div> 
            {
              loadMedia &&
              <div className="conversation-message_chat_row your-message">
                <img src={loadIcon} alt="loading" />
              </div>
            }
        </div>
      </div>
     
      <form className="conversation-message_chat-input" onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Nhập tin nhắn..." />
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
                <input type="file" name="file" id="file" multiple accept="image/*, video/*" onChange={handleChangeMedia} />
              </div>
             
              <button className="button_submit_mess" type="Submit">
                <i class="fa-regular fa-paper-plane"></i>
              </button>
        </div>
      </form>
    </div>
  );
};

export default RightSide;
