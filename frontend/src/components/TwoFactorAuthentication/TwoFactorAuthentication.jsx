import React, { useEffect, useRef, useState } from "react";
import "./TwoFactorAuthentication.css";
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';


const TwoFactorAuthentication= () => {
  const [timer, setTimer] = useState(40);
  const [isCounting, setIsCounting] = useState(true);
  const inputRefs = useRef([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  // Simulate sending code
  const handleSend = () => {
    console.log("📨 Code request sent");
  };

  // Verify code
  const verifyCode = (enteredCode) => {
    console.log(" Verifying code →", enteredCode);
    if (enteredCode === "123456") {
      console.log(" correct");
      navigate('/home-page');
    window.location.reload();
    } else {
      console.log(" wrong");
    }
  };

  // Handle timer end or manual resend
  const handleTimerFinished = () => {
    handleSend(); // send automatically
    setTimer(40);
    setIsCounting(true);

    // Reset code inputs
    const reset = ["", "", "", "", "", ""];
    setCode(reset);
    inputRefs.current.forEach((input) => (input.value = ""));
    inputRefs.current[0]?.focus();
  };

  // Auto-send on mount
  useEffect(() => {
    handleTimerFinished();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isCounting) return;

    if (timer === 0) {
      handleTimerFinished();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isCounting]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // Manual resend
  const handleResend = () => {
    handleTimerFinished();
  };

  // OTP input handling
  const handleInputChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    // Auto-submit when 6 digits are entered
    if (newCode.every((d) => d !== "")) {
      verifyCode(newCode.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputRefs.current[index].value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="twofa-container">
      <div className="twofa-card">
        <div className="twofa-icon-wrapper">
          <svg className="twofa-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <div className="twofa-header">
          <p className="twofa-title">Verification Required</p>
          <div className="one-line">
            <p className="twofa-subtitle">As a guest use:</p>
            <p className="twofa-email">123456</p>
          </div>
        </div>

        <form className="twofa-form" onSubmit={(e) => { e.preventDefault(); verifyCode(code.join("")); }}>
          <div className="twofa-inputs">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  placeholder="•"
                  className="twofa-input"
                  ref={(el) => {
  if (el) inputRefs.current[i] = el;
}}
                  onChange={(e) => handleInputChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
          </div>

          <button type="submit" className="twofa-submit">
            <span className="twofa-submit-content">
              Verify Code
              <svg className="twofa-submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <div className="twofa-divider one-line">
            <span className="twofa-divider-line"></span>
            <span className="twofa-divider-text">or</span>
            <span className="twofa-divider-line"></span>
          </div>

          <div className="twofa-resend-section">
            <div className="twofa-timer">
              <svg className="twofa-timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Resend code in <span className="twofa-timer-value">{formatTime(timer)}</span>
              </span>
            </div>

            <Button type="button" className="twofa-resend-btn" onClick={handleResend}>
              <svg className="twofa-resend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Resend Code
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthentication;
