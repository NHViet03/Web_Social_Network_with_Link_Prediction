import React from 'react'
import Avatar from '../sideBar/Avatar'

const MsgDisplay = () => {
  return (
    <>
        <div className='chat_title'>
        <Avatar src = {"https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"} size= "avatar-sm" ></Avatar>
        </div>
        <div className='chat_text'>
        Xin chào! Tôi là một trợ lý ảo được tạo ra bởi OpenAI. 
        Tôi ở đây để giúp bạn với bất kỳ câu hỏi hoặc vấn đề nào bạn có.
         Đừng ngần ngại liên hệ nếu bạn cần sự hỗ trợ!
        </div>
        <div className='chat_time'>
            2:00 PM
        </div>
    </>
  )
}

export default MsgDisplay