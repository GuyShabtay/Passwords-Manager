// src/components/FullApp/FullApp.jsx
import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import classNames from 'classnames';

// ------------------- Enums -------------------
export const UserStatus = {
  LoggedIn: "Logged In",
  LoggingIn: "Logging In",
  LoggedOut: "Logged Out",
  LogInError: "Log In Error",
  VerifyingLogIn: "Verifying Log In"
};

const Default = { PIN: "1234" };

export const WeatherType = {
  Cloudy: "Cloudy",
  Rainy: "Rainy",
  Stormy: "Stormy",
  Sunny: "Sunny"
};

// ------------------- Utilities -------------------
const N = {
  clamp: (min, value, max) => Math.min(Math.max(min, value), max),
  rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
};

const T = {
  format: (date) => {
    const hours = T.formatHours(date.getHours());
    const minutes = date.getMinutes();
    return `${hours}:${T.formatSegment(minutes)}`;
  },
  formatHours: (hours) => hours % 12 === 0 ? 12 : hours % 12,
  formatSegment: (segment) => (segment < 10 ? `0${segment}` : segment)
};

const LogInUtility = {
  verify: async (pin) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        pin === Default.PIN ? resolve(true) : reject(`Invalid pin: ${pin}`);
      }, N.rand(300, 700));
    })
};

// ------------------- Context -------------------
const AppContext = createContext(null);










const PinDigit = ({ focused, value }) => {
  const [hidden, setHiddenTo] = useState(false);
  useEffect(() => {
    if (value) {
      const timeout = setTimeout(() => setHiddenTo(true), 500);
      return () => {
        clearTimeout(timeout);
        setHiddenTo(false);
      };
    }
  }, [value]);
  return (
    <div className={classNames("app-pin-digit", { focused, hidden })}>
      <span className="app-pin-digit-value">{value || ""}</span>
    </div>
  );
};

const Pin = () => {
  const { userStatus, setUserStatusTo } = useContext(AppContext);
  const [pin, setPinTo] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (userStatus === UserStatus.LoggingIn || userStatus === UserStatus.LogInError) {
      ref.current.focus();
    } else {
      setPinTo("");
    }
  }, [userStatus]);

  useEffect(() => {
    if (pin.length === 4) {
      const verify = async () => {
        try {
          setUserStatusTo(UserStatus.VerifyingLogIn);
          if (await LogInUtility.verify(pin)) setUserStatusTo(UserStatus.LoggedIn);
        } catch {
          setUserStatusTo(UserStatus.LogInError);
        }
      };
      verify();
    }
    if (userStatus === UserStatus.LogInError) setUserStatusTo(UserStatus.LoggingIn);
  }, [pin]);

  const handleOnClick = () => ref.current.focus();
  const handleOnCancel = () => setUserStatusTo(UserStatus.LoggedOut);
  const handleOnChange = (e) => e.target.value.length <= 4 && setPinTo(e.target.value.toString());
  const getCancelText = () => <span id="app-pin-cancel-text" onClick={handleOnCancel}>Cancel</span>;
  const getErrorText = () => userStatus === UserStatus.LogInError && <span id="app-pin-error-text">Invalid</span>;

  return (
    <div id="app-pin-wrapper">
      <input
        disabled={userStatus !== UserStatus.LoggingIn && userStatus !== UserStatus.LogInError}
        id="app-pin-hidden-input"
        maxLength={4}
        ref={ref}
        type="number"
        value={pin}
        onChange={handleOnChange}
      />
      <div id="app-pin" onClick={handleOnClick}>
        <PinDigit focused={pin.length === 0} value={pin[0]} />
        <PinDigit focused={pin.length === 1} value={pin[1]} />
        <PinDigit focused={pin.length === 2} value={pin[2]} />
        <PinDigit focused={pin.length === 3} value={pin[3]} />
      </div>
      <h3 id="app-pin-label">
        Enter PIN (1234) {getErrorText()} {getCancelText()}
      </h3>
    </div>
  );
};

const UserStatusButton = ({ icon, id, userStatus: targetStatus }) => {
  const { userStatus, setUserStatusTo } = useContext(AppContext);
  const handleOnClick = () => setUserStatusTo(targetStatus);
  return (
    <button
      id={id}
      className="user-status-button clear-button"
      disabled={userStatus === targetStatus}
      type="button"
      onClick={handleOnClick}
    >
      <i className={icon} />
    </button>
  );
};

const Background = () => {
  const { userStatus, setUserStatusTo } = useContext(AppContext);
  const handleOnClick = () => userStatus === UserStatus.LoggedOut && setUserStatusTo(UserStatus.LoggingIn);
  return (
    <div id="app-background" onClick={handleOnClick}>
      <div id="app-background-image" className="background-image" />
    </div>
  );
};

const Loading = () => (
  <div id="app-loading-icon">
    <i className="fa-solid fa-spinner-third" />
  </div>
);

// ------------------- Full App -------------------
const FullApp = () => {
  const [userStatus, setUserStatusTo] = useState(UserStatus.LoggedOut);
  const getStatusClass = () => userStatus.replace(/\s+/g, "-").toLowerCase();

  return (
    <AppContext.Provider value={{ userStatus, setUserStatusTo }}>
      <div id="app" className={getStatusClass()}>
        <Pin />
        <Background />
        <div id="sign-in-button-wrapper">
          <UserStatusButton
            icon="fa-solid fa-arrow-right-to-arc"
            id="sign-in-button"
            userStatus={UserStatus.LoggingIn}
          />
        </div>
        <Loading />
      </div>
    </AppContext.Provider>
  );
};

export default FullApp;
