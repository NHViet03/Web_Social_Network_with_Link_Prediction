import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PageRender from "./customRouter/PageRender";
import LoginScreen from "./pages/login";
import Home from "./pages/home";
import SideBar from "./components/sideBar/SideBar";
import PostDetailModal from "./components/PostDetailModal";

function App() {
  const { postDetail } = useSelector((state) => state);
  return (
    <BrowserRouter>
      <div className="App">
        <div className="main">
          <SideBar />
          {postDetail && <PostDetailModal />}
          <div style={{ marginLeft: "250px" }}>
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
