import React from 'react'
import LeftSide from '../components/message/LeftSide'

const Message = () => {
  return (
    <div className='message d-flex col-9 px-0'>
      <div className="message_left-side col-md-4 px-0">
        <LeftSide />
      </div>
      <div className="message_right-side col-md-8 px-0 ">
        <div className="d-flex justify-content-center 
        align-items-center flex-column h-100">
            <i className='fab fa-facebook-messenger text-primary'
            style={{fontSize: '5rem'}}></i>
            <h4>Messenger</h4>
        </div>
      </div>
    </div>
  )
}

export default Message
