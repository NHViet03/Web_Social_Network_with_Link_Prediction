import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageRender from "./customRouter/PageRender";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import SideBar from "./components/sideBar/SideBar";
import PostDetailModal from "./components/PostDetailModal";
import SharePostModal from "./components/SharePostModal";
import AddPostModal from "./components/addPostModal";
import moment from "moment";

import Alert from "./components/alert/Alert";
import { refreshToken } from "./redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux/actions/postAction";
import { getNotifies } from "./redux/actions/notifyAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";
import CallModal from "./components/message/CallModal";
import { io } from "socket.io-client";
import SocketClient from "./SocketClient";
import Peer from "peerjs";
import VerifyOTP from "./pages/verifyOTP.js";
import ForgotPassword from "./pages/forgotpassword.js";
import ForgotPasswordVerifyOTP from "./pages/forgotpasswordverifyotp.js";
import ForgotPasswordChangePassword from "./pages/forgotpasswordchangepassword.js";
import BlockDeviceAccess from "./pages/blockDeviceAccess.js";
import Loading from "./components/alert/Loading.js";
import getClientInfo from "./utils/getClientInfo.js";

// Config moment
moment.updateLocale("vi", {
  relativeTime: {
    future: "trong %s",
    past: "%s trước",
    s: "1 giây",
    ss: "%d giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "một ngày",
    dd: "%d ngày",
    w: "1 tuần",
    ww: "%d tuần",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

function App() {
  const { postDetail, sharePost, addPostModal, auth, modal, call } =
    useSelector((state) => ({
      postDetail: state.postDetail,
      sharePost: state.sharePost,
      addPostModal: state.addPostModal,
      auth: state.auth,
      modal: state.modal,
    }));
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postDetail || sharePost || addPostModal || modal) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(refreshToken());
      setLoading(false);
    };

    fetchData();

    const socket = io("ws://localhost:5000");
    dispatch({
      type: GLOBAL_TYPES.SOCKET,
      payload: socket,
    });

    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts({ auth }));
      dispatch(getNotifies(auth.token));
    }
  }, [auth, dispatch]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "/",
      port: 3001,
    });
    dispatch({ type: GLOBAL_TYPES.PEER, payload: newPeer });
  }, []);

  useEffect(() => {
    const getClientData = async () => {
      await getClientInfo();
    };

    getClientData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <input type="checkbox" id="theme" />
      <Alert />
      <div className="App">
        <div className="main">
          <SideBar />
          {postDetail && <PostDetailModal />}
          {sharePost && <SharePostModal />}
          {addPostModal && <AddPostModal />}
          {auth.token && <SocketClient />}
          {call !== null && <CallModal />}

          <div className="main_container">
            <Routes>
              <Route path="/" element={auth.token ? <Home /> : <Login />} />
              <Route
                path="/login"
                element={auth.token ? <Home /> : <Login />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/verifyOTP" element={<VerifyOTP />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route
                path="/forgotpassword/verifyotp"
                element={<ForgotPasswordVerifyOTP />}
              />
              <Route
                path="/forgotpassword/changepassword"
                element={<ForgotPasswordChangePassword />}
              />

              <Route
                path="/blockdevice/:userId/:deviceId"
                element={<BlockDeviceAccess />}
              />

              <Route path="/:page" element={<PageRender />} />
              <Route path="/:page/:id" element={<PageRender />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
