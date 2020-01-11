import React from "react";
import "./App.scss";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="App d-flex flex-column justify-content-center align-items-center">
      <Link to="/request">
        <button className="btn btn-outline-info home-btn">Requset Form</button>
      </Link>
      <span className="py-3">OR</span>
      <Link to="/status">
        <button className="btn btn-outline-info home-btn">Status Page</button>
      </Link>
    </div>
  );
};

export default App;
