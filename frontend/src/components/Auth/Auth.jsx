import React, { useState, useEffect } from "react";
import Login from "../Login1/Login";
import Register from "../Register1/Register";
import "./Auth.css";
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import logo from '../../assets/images/logo.png';



const Auth = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [shouldRenderRegister, setShouldRenderRegister] = useState(false);
  const [shouldRenderLogin, setShouldRenderLogin] = useState(true);

  // Handle Register box
  useEffect(() => {
    if (showRegister) {
      setShouldRenderRegister(true);
      setShouldRenderLogin(true); // keep login until fade-out ends
    } else {
      // Delay unmount AFTER fade animation
      const timeout = setTimeout(() => {
        setShouldRenderRegister(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showRegister]);

  // Handle Login box unmount delay
  useEffect(() => {
    if (!showRegister) {
      setShouldRenderLogin(true);
    } else {
      const timeout = setTimeout(() => {
        setShouldRenderLogin(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showRegister]);

  return (
    <div id="auth-wrapper">
    
            <div className="auth-logo-box one-line">
              <PasswordRoundedIcon className='auth-password-logo'/>
              <img src={logo} alt='text logo' className='auth-text-logo' />
            </div>
      {/* LOGIN BOX */}
      <div
        className={`auth-box login-box ${
          showRegister ? "fade-right-out" : "fade-right-in"
        }`}
      >
        {shouldRenderLogin && (
          <Login setShowRegister={setShowRegister} />
        )}
      </div>

      {/* REGISTER BOX */}
      <div
        className={`auth-box register-box ${
          showRegister ? "fade-left-in" : "fade-left-out"
        }`}
      >
        {shouldRenderRegister && (
          <Register setShowRegister={setShowRegister} />
        )}
      </div>
    </div>
  );
};

export default Auth;
