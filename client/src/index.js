import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataProvider from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);

reportWebVitals();
