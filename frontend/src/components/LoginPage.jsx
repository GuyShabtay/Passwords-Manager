// src/App.jsx
import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

// ------------------- Context -------------------
const AppContext = createContext(null);

export const UserStatus = {
  LoggedIn: "LoggedIn",
  LoggingIn: "LoggingIn",
  LoggedOut: "LoggedOut",
  LogInError: "LogInError",
};

// ------------------- Utilities -------------------
const Default = { PIN: "1234" };
const verifyPin = (pin) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      pin === Default.PIN ? resolve(true) : reject(false);
    }, 500);
  });

// ------------------- Components -------------------
const PinDigit = ({ focused, value }) => (
  <div className={`pin-digit ${focused ? "focused" : ""}`}>{value || ""}</div>
);

const PinInput = () => {
  const { setUserStatus } = useContext(AppContext);
  const [pin, setPin] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      const check = async () => {
        try {
          if (await verifyPin(pin)) {
            setUserStatus(UserStatus.LoggedIn);
            navigate("/home");
          }
        } catch {
          setUserStatus(UserStatus.LogInError);
          setPin("");
        }
      };
      check();
    }
  }, [pin]);

  return (
    <div className="pin-wrapper">
      <input
        ref={inputRef}
        type="number"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.slice(0, 4))}
        className="hidden-input"
      />
      <div className="pin-digits" onClick={() => inputRef.current.focus()}>
        <PinDigit value={pin[0]} focused={pin.length === 0} />
        <PinDigit value={pin[1]} focused={pin.length === 1} />
        <PinDigit value={pin[2]} focused={pin.length === 2} />
        <PinDigit value={pin[3]} focused={pin.length === 3} />
      </div>
      <div className="pin-label">Enter PIN (1234)</div>
    </div>
  );
};

const LoginPage = () => {
  const [userStatus, setUserStatus] = useState(UserStatus.LoggingIn);

  return (
    <AppContext.Provider value={{ userStatus, setUserStatus }}>
      <div className="login-page">
        <button className="login-button" onClick={() => setUserStatus(UserStatus.LoggingIn)}>
          Login
        </button>
        <PinInput />
      </div>
    </AppContext.Provider>
  );
};

const HomePage = () => (
  <div className="home-page">
    <h1>Home</h1>
    <button>Another Button</button>
  </div>
);


export default LoginPage;
