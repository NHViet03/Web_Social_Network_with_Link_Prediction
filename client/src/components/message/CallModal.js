import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { addMessage } from "../../redux/actions/messageAction";

import Avatar from "../Avatar";
import { generateObjectId } from "../../utils/helper";

const CallModal = () => {
  const { call, auth, socket, peer } = useSelector((state) => state);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const youVideo = useRef();
  const otherVideo = useRef();

  const [tracks, setTracks] = useState(null);
  const dispatch = useDispatch();

  // Set Time
  useEffect(() => {
    const setTime = () => {
      setTotal((prev) => prev + 1);
      setTimeout(setTime, 1000);
    };
    setTime();
    return () => setTotal(0);
  }, []);

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        if (tracks) {
          tracks.forEach((track) => {
            track.stop();
          });
        }
        socket.emit("endCall", call);
        dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
      }, 45000);
      return () => clearTimeout(timer);
    }
  }, [answer, dispatch, socket, call, tracks]);

  // Stream Media
  const openStream = async (preferredLabel = "") => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );

    let selectedDevice = videoInputs[0]; // fallback

    if (preferredLabel) {
      const found = videoInputs.find((device) =>
        device.label.toLowerCase().includes(preferredLabel.toLowerCase())
      );
      if (found) selectedDevice = found;
    }

    const constraints = {
      audio: true,
      video: selectedDevice
        ? { deviceId: { exact: selectedDevice.deviceId } }
        : true,
    };

    return navigator.mediaDevices.getUserMedia(constraints);
  };

  const playStream = (videoTag, stream) => {
    if (!videoTag || !stream) return;

    videoTag.srcObject = stream;

    videoTag.onloadedmetadata = () => {
      videoTag
        .play()
        .then(() => {
          // OK
        })
        .catch((err) => {
          console.error("Error playing video:", err);
        });
    };
  };

  const handleAnswer = () => {
    // Ví dụ: máy B dùng OBS Virtual Cam
    openStream("OBS").then((stream) => {
      playStream(youVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);

      const newCall = peer.call(call.peerId, stream);
      newCall.on("stream", (remoteStream) => {
        playStream(otherVideo.current, remoteStream);
      });
      setAnswer(true);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      // Ví dụ: máy A dùng camera thật (không OBS)
      openStream("integrated").then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);

        newCall.answer(stream);

        newCall.on("stream", (remoteStream) => {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });
        setAnswer(true);
      });
    });
    return () => peer.removeListener("call");
  }, [peer, call?.video]);

  const addCallMessage = (call, times) => {
    const message = {
      sender: {
        _id: auth.user._id,
        avatar: auth.user.avatar,
        fullname: auth.user.fullname,
        username: auth.user.username,
      },
      conversationID:
        call.recipient === auth.user._id ? call.sender : call.recipient,
      recipients: [call.recipient, auth.user._id],
      isRevoke: false,
      isEdit: false,
      text: "",
      media: [],
      call: {
        video: call.video,
        times,
      },
      isGroup: false,
      _id: generateObjectId(),
      isVisible: {},
      replymessage: null,
      whoEndCall: auth.user._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("addCallMessage", message);
    dispatch(addMessage({ msg: message, auth, socket }));
  };
  // End Call
  const handeEndCall = () => {
    console.log("End Call");
    if (tracks) {
      tracks.forEach((track) => {
        track.stop();
      });
    }
    let times = answer ? total : 0;
    socket.emit("endCall", { ...call, times });
    addCallMessage(call, times);

    dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
  };
  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      socket.on("endCallToClient", (data) => {
        if (tracks) {
          tracks.forEach((track) => {
            track.stop();
          });
        }
        dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
      });
      return () => socket.off("endCallToClient");
    }
  }, [socket, dispatch, tracks]);

  //Disconnect
  useEffect(() => {
    socket.on("callerDisconnect", () => {
      if (tracks) {
        tracks.forEach((track) => {
          track.stop();
        });
      }
      dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Người gọi đã ngắt kết nối" },
      });
    });
    return () => socket.off("callerDisconnect");
  }, [socket, dispatch, tracks]);

  return (
    <>
      {call === null ? (
        <></>
      ) : (
        <div className="call_modal">
          <div
            className="call_box"
            style={{ opacity: answer && call.video ? "0" : "1" }}
          >
            <div className="text-center call_modal_name">
              <div className="call_modal_avatar">
                {" "}
                <Avatar src={call?.avatar} size="avatar-lg" />
              </div>
              <h4 className="">{call?.username}</h4>
              <h6>{call?.fullname}</h6>
              {answer ? (
                <div>
                  <small>
                    {hours.toString().length < 2 ? "0" + hours : hours}
                  </small>
                  <small>:</small>
                  <small>
                    {mins.toString().length < 2 ? "0" + mins : mins}
                  </small>
                  <small>:</small>
                  <small>
                    {second.toString().length < 2 ? "0" + second : second}
                  </small>
                </div>
              ) : (
                <div>
                  {call.video == true ? (
                    <span>Đang gọi video...</span>
                  ) : (
                    <span>Đang gọi điện thoại</span>
                  )}
                </div>
              )}
            </div>
            {!answer && (
              <div className="timer">
                <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
                <small>:</small>
                <small>
                  {second.toString().length < 2 ? "0" + second : second}
                </small>
              </div>
            )}

            <div className="call_menu">
              <span
                className="material-icons text-danger"
                onClick={handeEndCall}
              >
                call_end
              </span>
              {call.recipient === auth.user._id && !answer && (
                <>
                  {call.video != true ? (
                    <span
                      className="material-icons text-success"
                      onClick={handleAnswer}
                    >
                      call
                    </span>
                  ) : (
                    <span
                      className="material-icons text-success"
                      onClick={handleAnswer}
                    >
                      videocam
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className="show_video"
            style={{ display: answer && call.video ? "block" : "none" }}
          >
            <div className="video_wrapper">
              <div className="left_box">
                <video ref={youVideo} className="you_video" />
              </div>
              <div className="right_box">
                <video ref={otherVideo} className="other_video" />
              </div>
            </div>

            <div className="time_video">
              <small>{hours.toString().length < 2 ? "0" + hours : hours}</small>
              <small>:</small>
              <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
              <small>:</small>
              <small>
                {second.toString().length < 2 ? "0" + second : second}
              </small>
            </div>

            <span
              className="material-icons text-danger end_call"
              onClick={handeEndCall}
            >
              call_end
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CallModal;
