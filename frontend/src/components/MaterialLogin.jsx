import React, { useState } from "react";
import "./MaterialLogin.css";

export default function MaterialLogin() {
  const [active, setActive] = useState(false);

  return (
    <div>
      {/* Pen Title */}
      <div className="pen-title">
        <h1>Material Login Form</h1>
        <span>
          Pen <i className="fa fa-code"></i> by{" "}
          <a href="http://andytran.me">Andy Tran</a>
        </span>
      </div>

      <div className="rerun">
        <a href="">Rerun Pen</a>
      </div>

      {/* Container */}
      <div className={`container ${active ? "active" : ""}`}>
        <div className="card"></div>

        {/* Login Card */}
        <div className="card">
          <h1 className="title">Login</h1>
          <form>
            <div className="input-container">
              <input type="text" id="username" required />
              <label htmlFor="username">Username</label>
              <div className="bar"></div>
            </div>

            <div className="input-container">
              <input type="password" id="password" required />
              <label htmlFor="password">Password</label>
              <div className="bar"></div>
            </div>

            <div className="button-container">
              <button type="button">
                <span>Go</span>
              </button>
            </div>

            <div className="footer">
              <a href="#">Forgot your password?</a>
            </div>
          </form>
        </div>

        {/* Register Alt Card */}
        <div className="card alt">
          <div className="toggle" onClick={() => setActive(true)}></div>

          <h1 className="title">
            Register
            <div className="close" onClick={() => setActive(false)}></div>
          </h1>

          <form>
            <div className="input-container">
              <input type="text" required />
              <label>Username</label>
              <div className="bar"></div>
            </div>

            <div className="input-container">
              <input type="password" required />
              <label>Password</label>
              <div className="bar"></div>
            </div>

            <div className="input-container">
              <input type="password" required />
              <label>Repeat Password</label>
              <div className="bar"></div>
            </div>

            <div className="button-container">
              <button type="button">
                <span>Next</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <a id="portfolio" href="http://andytran.me/" title="View my portfolio!">
        <i className="fa fa-link"></i>
      </a>

      <a
        id="codepen"
        href="https://codepen.io/andytran/"
        title="Follow me!"
      >
        <i className="fa fa-codepen"></i>
      </a>
    </div>
  );
}
