import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import stylesLogin from "../assets/css/Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API;
const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/main");
    }else {
        alert(data.message);
    }
};

  return (
    <div className={stylesLogin.Body}>
        <div className={stylesLogin.Main}>
        <p>Login</p>

        <div className={stylesLogin.Input}>
          <input placeholder="Username"  required  onChange={(e) => setUsername(e.target.value)}
          />
          <input type="password"  placeholder="Password"  required  onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={stylesLogin.Buttons}>
          <button onClick={handleLogin}>Login</button>
        </div>

        <Link to="/signup" className={stylesLogin.Link}> Create an account</Link>
        </div>
    </div>
  );
}

export default Login;