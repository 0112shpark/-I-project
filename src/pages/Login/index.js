import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import {
  getStorage,
  ref as stRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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
import EmailLogin from "./emailLogin";

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
  const PhotoUrl =
    "https://firebasestorage.googleapis.com/v0/b/jaban-7c8c2.appspot.com/o/fish.png?alt=media&token=01e42c45-1b16-4001-a8df-95bfb54d02df";
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

  const downloadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };
  /* ===========================
      Events
  ============================ */

  const handleAuth = () => {
    const db = getDatabase();

    const checkEmailExists = async (email) => {
      try {
        const snapshot = await get(ref(db, "users"));
        const users = snapshot.val();
        const userWithEmail = Object.values(users).find(
          (user) => user.email === email
        );
        return userWithEmail;
      } catch (error) {
        throw error;
      }
    };

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("user-email:", result.user.providerData[0].email);
        console.log("user-name:", result.user.displayName);

        const email = result.user.providerData[0].email;

        setUserData(result.user);
        localStorage.setItem("userData", JSON.stringify(result.user));

        checkEmailExists(email)
          .then((existingUser) => {
            if (existingUser) {
              // User with the same email already exists in the database
              console.log(
                "User with the same email already exists:",
                existingUser
              );
              // Proceed with login or any other necessary actions
            } else {
              // User with the same email does not exist in the database
              // Proceed with setting the database and other actions

              const userId = result.user.uid;

              const storage = getStorage();
              const storageRef = stRef(storage, `photos/${userId}`);

              const downloadImage = async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return blob;
              };

              downloadImage(result.user.photoURL)
                .then((blob) => {
                  console.log(blob);
                  uploadBytes(storageRef, blob)
                    .then((snapshot) => {
                      console.log("Photo uploaded successfully");

                      getDownloadURL(snapshot.ref)
                        .then((photoURL) => {
                          console.log("Photo download URL:", photoURL);

                          set(ref(db, "users/" + userId), {
                            username: result.user.displayName,
                            email: email,
                            photoUrl: photoURL,
                            friends: "0",
                          });
                          set(ref(db, "friends/" + userId));
                        })
                        .catch((error) => {
                          console.log(
                            "Error getting photo download URL:",
                            error
                          );
                        });
                    })
                    .catch((error) => {
                      console.log("Error uploading photo:", error);
                    });
                })
                .catch((error) => {
                  console.log("Error downloading photo:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking email existence:", error);
          });
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
        const userId = result.user.uid;
        const db = getDatabase();
        set(ref(db, "users/" + userId), {
          username: result.user.displayName,
          email: result.user.providerData[0].email,
          photoURL: result.user.photoURL,
          friends: "0",
        });
        set(ref(db, "friends/" + userId));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name;
    if (name === "signup") {
      setisSignUP(true);
      try {
        await SignUp(Email, Password, UserName, PhotoUrl);
        console.log("Email:", Email);
        console.log("Photo:", PhotoUrl);
        console.log("Password:", Password);
        console.log("Username:", UserName);
      } catch (error) {
        console.error(error);
      }
    } else if (name === "login") {
      EmailLogin(Email, Password);
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
          <img src="/images/logo_black.png" className="welcome" alt="logo" />
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
            {/* <div
              className="buttons__signup buttons__signup--social"
              onClick={handleFaceBook}
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </div> */}
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
            {/* <div
              className="buttons__signup buttons__signup--social"
              onClick={handleFaceBook}
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </div> */}
            <div
              className="buttons__signup buttons__signup--social"
              onClick={handleAuth}
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
