import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import stylesLogin from "../assets/css/Signup.module.css";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API;


    const handleSignup = async () => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account created!");
        navigate("/", { replace: true });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className={stylesLogin.Body}>
      <div className={stylesLogin.Main}>
        <p>Sign Up</p>

        <div className={stylesLogin.Input}>
          <input placeholder="Username"  required  onChange={(e) => setUsername(e.target.value)}
          />
          <input type="password"  placeholder="Password"  required  onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={stylesLogin.Buttons}>
          <button type="button" onClick={handleSignup} > Create Account </button>
        </div>

        <Link to="/" className={stylesLogin.Link}> Already have an account?</Link>
      </div>
    </div>
  );
}

export default Signup;