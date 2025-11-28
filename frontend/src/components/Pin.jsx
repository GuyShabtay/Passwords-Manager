import React, { useState, useEffect, useRef } from "react";

const DEFAULT_PIN = "1234";

const Pin = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === DEFAULT_PIN) {
        onSuccess();
      } else {
        setError(true);
        setPin("");
        inputRef.current.focus();
      }
    }
  }, [pin]);

  return (
    <div className="pin-wrapper">
      <input
        ref={inputRef}
        type="number"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="pin-input"
      />
      {error && <span className="pin-error">Invalid PIN</span>}
    </div>
  );
};

export default Pin;
