import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageRender from "./customRouter/PageRender";
import Login from "./pages/login";
import Home from "./pages/home";
import SideBar from "./components/sideBar/SideBar";
import Alert from "./components/alert/Alert";
import { refreshToken } from "./redux/actions/authAction";
import { UseSelector, useDispatch, useSelector } from "react-redux";

function App() {
  const {auth} = useSelector((state) => state);
  const dispatch = useDispatch();
   useEffect (() => {
    dispatch(refreshToken());
  },[dispatch])
  return (
    <BrowserRouter>
      <Alert />
      <div className="App">
        <div className="main row">
         {auth.token && <SideBar />}
          <Routes>
            <Route  path="/" element={auth.token ? <Home/> : <Login/>} />
            <Route  path="/:page" element={<PageRender />} />
            <Route  path="/:page/:id" element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
