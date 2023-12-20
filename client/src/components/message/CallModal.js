import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

import Avatar from "../Avatar";

const CallModal = () => {
  const { call, auth, socket } = useSelector((state) => state);
  const [mins, setMins] = useState(0)
  const [second, setSecond] = useState(0)
  const [total, setTotal] = useState(0)
  const [answer, setAnswer] = useState(false)
  const dispatch = useDispatch();

  // Set Time
  useEffect(() => {
    const setTime = () => {
      setTotal((prev) => prev + 1)
      setTimeout(setTime, 1000)
    }
    setTime()
    return () => setTotal(0)
  }, [])

  useEffect(() => {
    setSecond(total%60)
    setMins(parseInt(total/60))
  }, [total])

  useEffect(() => { 
      if(answer)
   {
    setTotal(0)
   }else{
    const timer = setTimeout(() => {
      dispatch({type: GLOBAL_TYPES.CALL, payload: null})
    }, 15000);
    return () => clearTimeout(timer)
   }
  }, [answer, dispatch])

  const handleAnswer = () => {
    setAnswer(true)
  }
    // End Call
    const handeEndCall = () => {
      dispatch({ type: GLOBAL_TYPES.CALL , payload: null});
      socket.emit('endCall', call)
    }
    useEffect(() => {
      if (socket && typeof socket.on === 'function') {
        socket.on('endCallToClient', data => {
          dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
        });
        return () => socket.off('endCallToClient');
      }
    }, [socket, dispatch]);
    
  return (
    <>
      {call === null ? (
        <></>
      ) : (
        <div className="call_modal">
          <div className="call_box">
           <div className="text-center">
              <Avatar src={call?.avatar} size="avatar-lg" />
              <h4 className="mt-4">{call?.username}</h4>
              <h6>{call?.fullname}</h6>
                {
                  answer 
                  ? 
                  <div>
                      <small>{mins.toString().length < 2 ? '0' +mins : mins}</small>
                      <small>:</small>
                      <small>{second.toString().length < 2 ? '0' +second : second}</small>
                  </div>
                  : <div>
                      {call?.video ? (
                        <span>Đâng gọi video...</span>
                      ) : (
                        <span>Đang gọi điện thoại</span>
                      )}
              </div>
                }
             
           </div>

            <div className="timer">
                <small>{mins.toString().length < 2 ? '0' +mins : mins}</small>
                <small>:</small>
                <small>{second.toString().length < 2 ? '0' +second : second}</small>
          </div>
          <div className="call_menu">
                <span className="material-icons text-danger" onClick={handeEndCall}>call_end</span>
                {
                  (call.recipient === auth.user._id && !answer) &&
                  <>
                  {
                    call.video ?
                    <span className="material-icons text-success" onClick={handleAnswer}>
                      videocam
                    </span>
                    :
                    <span className="material-icons text-success" onClick={handleAnswer}>
                      call
                    </span>
                  }
                </>
                }
               
          </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default CallModal;
