import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";
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
  const { postDetail, sharePost, addPostModal,auth } = useSelector((state) => ({
    postDetail: state.postDetail,
    sharePost: state.sharePost,
    addPostModal: state.addPostModal,
    auth:state.auth
  }));

  useEffect(() => {
    if (postDetail || sharePost || addPostModal) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth));
    }
  }, [auth, dispatch]);

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
          <div className="main_container">
            <Routes>
              <Route  path="/" element={auth.token ? <Home/> : <Login/>} />
              <Route path="/register" element={<Register />} />
              <Route path="/:page" element={<PageRender />}  />
              <Route path="/:page/:id" element={<PageRender />}  />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
