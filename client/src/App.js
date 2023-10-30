import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageRender from "./customRouter/PageRender";
import LoginScreen from "./pages/login";
import Home from "./pages/home";
import SideBar from "./components/sideBar/SideBar";
import {useSelector} from 'react-redux'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <div className="main row">
          <SideBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:page" element={<PageRender />} />
            <Route path="/:page/:id" element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
