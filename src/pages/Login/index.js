import React, { useEffect, useState } from "react";
import "./Login.css";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../hooks/userData";
import SignUp from "./signUp";
import emailLogin from "./emailLogin";

const Login = () => {
  /* ===========================
      Elements Selectors
  ============================ */
  const [elm, setelm] = useState({});
  const [props, setProps] = useState({});
  const [elms, setElms] = useState([]);
  // const initialUserData = localStorage.getItem("userData")
  //   ? JSON.parse(localStorage.getItem("userData"))
  //   : {};
  // const [userData, setUserData] = useState(initialUserData);
  const { userData, setUserData, clearUserData } = useData({});
  const [Email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [isSignUP, setisSignUP] = useState(true);
  const auth = getAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  var provider = new GoogleAuthProvider();
  provider.addScope("email");
  var FacebookProvider = new FacebookAuthProvider();
  FacebookProvider.addScope("email");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user:", user);
        if (pathname === "/") navigate("/main");
      } else {
        //console.log("login");
        navigate("/");
      }
    });
  }, [auth, navigate, pathname]);

  useEffect(() => {
    setelm({
      arrow: document.querySelector(".form-container__arrow"),
      overlay: document.querySelector(".overlay"),
      title: document.querySelector(".title"),
      signUpButton: document.querySelector(".buttons__signup"),
      loginButton: document.querySelector(".buttons__signup--login"),
      loginForm: document.querySelector(".login-form"),
      registerForm: document.querySelector(".login-form--register"),
    });
    setProps({
      left: "left: 20px;",
      bottom: "bottom: -500px;",
      transition1: "transition: bottom 1s;",
      transition2: "transition: bottom 2s;",
      opacity0: "opacity: 0;",
      opacity1: "opacity: 1;",
      trnsDelay: "transition-delay: 1s;",
      zIndex: "z-index: 6;",
      left0: "left: 0;",
      trnsDelay0: "transition-delay: 0s;",
      zIndex0: "z-index: 0;",
      leftM120: "left: -120px;",
    });
    setElms([
      elm.arrow,
      elm.overlay,
      elm.title,
      elm.signUpButton,
      elm.loginButton,
      elm.loginForm,
      elm.registerForm,
    ]);
  }, [
    elm.arrow,
    elm.loginButton,
    elm.loginForm,
    elm.overlay,
    elm.registerForm,
    elm.signUpButton,
    elm.title,
  ]);

  /* ===========================
      Properties Object
  ============================ */

  /* ===========================
      Elements Array
  ============================ */

  const transition = (elements, props) => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute("style", `${props[i]}`);
    }
  };

  /* ===========================
      Events
  ============================ */

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        //providerData[0]에 email, displayName으로 저장되어있음
        console.log("user-email:", result.user.providerData[0].email);
        console.log("user-name:", result.user.displayName);

        setUserData(result.user);
        localStorage.setItem("userData", JSON.stringify(result.user));
      })
      .catch((error) => console.error(error));
  };

  const handleFaceBook = () => {
    signInWithPopup(auth, FacebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log("token: ", token);
        console.log("photourl: ", user.photoURL + "?access_token=" + token);
        const newPhotoURL = user.photoURL + "?access_token=" + token;
        user.photoURL = newPhotoURL;
        console.log("user??:", user);
        console.log("user-email:", result.user.providerData[0].email);
        console.log("user-name:", result.user.displayName);
        setUserData(user);
        localStorage.setItem("userData", JSON.stringify(user));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "username") {
      setUserName(value);
    }
  };

  const handleSubmit = (event) => {
    localStorage.removeItem("userData");
    clearUserData();
    event.preventDefault();
    const name = event.target.name;
    if (name === "signup") {
      setisSignUP(true);
      SignUp(Email, Password, UserName);
      console.log("Email:", Email);
      console.log("Password:", Password);
      console.log("Username:", UserName);
    } else if (name === "login") {
      emailLogin(Email, Password);
      setisSignUP(false);
    }
  };

  //basic animations
  const handleSignIn = () => {
    const properties = [
      props.left,
      props.opacity0,
      props.opacity0,
      `${props.transition1} ${props.bottom}`,
      `${props.transition2} ${props.bottom}`,
      props.opacity0,
      `${props.opacity1} ${props.trnsDelay} ${props.zIndex}`,
    ];
    console.log(elms);
    transition(elms, properties);
  };

  const handleLogin = () => {
    const properties = [
      props.left,
      props.opacity0,
      props.opacity0,
      `${props.transition1} ${props.bottom}`,
      `${props.transition2} ${props.bottom}`,
      `${props.opacity1} ${props.trnsDelay} ${props.zIndex}`,
      props.opacity0,
    ];

    transition(elms, properties);
  };

  const handleButton = () => {
    const properties = [
      props.leftM120,
      props.opacity1,
      props.opacity1,
      props.opacity1,
      props.opacity1,
      `${props.opacity0} ${props.trnsDelay0} ${props.zIndex0}`,
      `${props.opacity0} ${props.trnsDelay0} ${props.zIndex0}`,
    ];

    transition(elms, properties);
  };
  // };
  // window.addEventListener("load", start);

  return (
    <section className="form-container">
      <span id="arrowClick" className="form-container__arrow">
        <i
          className="fa fa-arrow-circle-left"
          aria-hidden="true"
          onClick={handleButton}
        ></i>
      </span>
      <div className="overlay"></div>
      <div className="choose-form">
        <div className="title">
          <h1 className="title__h1">
            (환영문구 추천)
            <br />
          </h1>
        </div>
        <div className="buttons">
          <div id="signUp" className="buttons__signup" onClick={handleSignIn}>
            Sign up
          </div>
          <div
            id="login"
            className="buttons__signup buttons__signup--login"
            onClick={handleLogin}
          >
            Login
          </div>
        </div>
      </div>

      <div className="login-form">
        <div className="form-wrapper">
          <form method="post" name="login" onSubmit={handleSubmit}>
            <label className="form-wrapper__label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email1"
              className="form-wrapper__input"
              type="email"
              placeholder="example@hotmail.com"
              name="email"
              required
              value={Email}
              onChange={handleInputChange}
            />
            <label className="form-wrapper__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-wrapper__input"
              type="password"
              placeholder="Password"
              name="password"
              pattern=".{3,}"
              title="Password must contain at least 3 characters"
              required
              value={Password}
              onChange={handleInputChange}
            />
            <div className="login-form__forgot-password">Forgot password?</div>
            <button
              className="buttons__signup buttons__signup--login-form"
              type="submit"
            >
              Login
            </button>
          </form>

          <div className="social-media">
            <h6 className="title__h2">Or connect with</h6>
            <div
              className="buttons__signup buttons__signup--social"
              onClick={handleFaceBook}
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </div>
            <div
              className="buttons__signup buttons__signup--social"
              onClick={handleAuth}
            >
              <i className="fab fa-google" aria-hidden="true"></i>&nbsp;google
            </div>
          </div>
        </div>
      </div>

      <div className="login-form login-form--register">
        <div className="form-wrapper">
          <form method="post" name="signup" onSubmit={handleSubmit}>
            <label className="form-wrapper__label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="form-wrapper__input"
              type="email"
              placeholder="example@hotmail.com"
              name="email"
              required
              value={Email}
              onChange={handleInputChange}
            />
            <label className="form-wrapper__label" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              className="form-wrapper__input"
              type="text"
              placeholder="Username"
              name="username"
              required
              value={UserName}
              onChange={handleInputChange}
            />
            <label className="form-wrapper__label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="form-wrapper__input"
              type="password"
              placeholder="Password"
              name="password"
              pattern=".{3,}"
              title="Password must contain at least 3 characters"
              required
              value={Password}
              onChange={handleInputChange}
            />
            <button
              className="buttons__signup buttons__signup--sign-up-form"
              type="submit"
            >
              Sign up
            </button>
            <div
              id="login"
              className="buttons__signup buttons__signup--login"
              onClick={handleLogin}
              style={{ position: "relative" }}
            >
              Go to Login Page
            </div>
          </form>

          <div className="social-media">
            <h2 className="title__h2">Or connect with</h2>
            <div
              className="buttons__signup buttons__signup--social"
              //onClick={handleClick}
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </div>
            <div
              className="buttons__signup buttons__signup--social"
              //onClick={handleClick}
            >
              <i className="fab fa-google" aria-hidden="true"></i>&nbsp;google
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
