import React from "react";
import MainContent from "../components/home/MainContent";
import Suggestions from "../components/home/Suggestions";

const   Home = () => {
  return (
    <div className="row mx-0 home">
      <MainContent />
      <Suggestions />
    </div>
  );
};

export default Home;
