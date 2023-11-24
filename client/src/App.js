import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PageRender from "./customRouter/PageRender";
import LoginScreen from "./pages/login";
import Home from "./pages/home";
import SideBar from "./components/sideBar/SideBar";
import PostDetailModal from "./components/PostDetailModal";
import SharePostModal from "./components/SharePostModal";
import AddPostModal from "./components/addPostModal";
import moment from "moment";

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
  const { postDetail, sharePost,addPostModal } = useSelector((state) => ({
    postDetail: state.postDetail,
    sharePost: state.sharePost,
    addPostModal:state.addPostModal
  }));

  useEffect(() => {
    if (postDetail || sharePost|| addPostModal) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  });

  return (
    <BrowserRouter>
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          <SideBar />
          {postDetail && <PostDetailModal />}
          {sharePost && <SharePostModal />}
          {addPostModal && <AddPostModal />}
          <div className="main_container">
            <Routes>
              <Route path="/" element={<Home />} />
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
