import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Alert from "./components/Alert";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import Home from "./pages/home";
import PageRender from "./customRouter/PageRender";

import { useSelector } from "react-redux";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function App() {
  const [showSideBar, setShowSideBar] = useState(true);
  const loading = useSelector((state) => state.loading);

  return (
    <BrowserRouter>
      <div className="App">
        {loading && <Loading />}
        <Alert />

        <SideBar showSideBar={showSideBar} />
        <div
          className="main_container"
          style={{
            marginLeft: showSideBar ? "250px" : "0",
          }}
        >
          <Header setShowSideBar={setShowSideBar} />
          <div
            style={{
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:page" element={<PageRender />} />
              <Route path="/:page/:id" element={<PageRender />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
