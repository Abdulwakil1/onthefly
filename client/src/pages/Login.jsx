import React from "react";
import { AUTH_URL } from "../config";

const Login = () => {
  return (
    <div className="Login">
      <h1>On the Fly ✈️</h1>

      <center>
        <a href={`${AUTH_URL}/github`}>
          <button className="headerBtn">🔒 Login via GitHub</button>
        </a>
      </center>
    </div>
  );
};

export default Login;
