import React, { useEffect, useState } from "react";
import "./Nav.css";
import { MdOutlineTravelExplore } from "react-icons/md";
import { RiCloseFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { BsInfoCircle } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../hooks/userData";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAHcapNthGtxiWfwLqFJ-lAaixYIHNhDdw",
  authDomain: "jaban-7c8c2.firebaseapp.com",
  databaseURL: "https://jaban-7c8c2-default-rtdb.firebaseio.com",
  projectId: "jaban-7c8c2",
  storageBucket: "jaban-7c8c2.appspot.com",
  messagingSenderId: "862801813260",
  appId: "1:862801813260:web:4a8e0911e28ed43cd5b329",
  measurementId: "G-B6Q439LLL4",
};

const Nav = () => {
  const [active, setActive] = useState("navBar");
  const auth = getAuth();
  const navigate = useNavigate();
  const { userData, clearUserData } = useData({});
  const { pathname } = useLocation();
  const [path, setPath] = useState("/main");

  const [text, setText] = useState("");
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const userId = database.ref(`users/${userData.uid}`);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  //toggle

  const renderNav = () => {
    if (path === "/main") {
      return (
        <>
          <li className="navItem">
            <a href="/About" className="navLink">
              <BsInfoCircle className="icon" /> About
            </a>
          </li>
          {userData && (
            <li className="navItem">
              <a href={`../MyPage?userId=${userData.uid}`} className="navLink">
                <CgProfile className="icon" /> MY Page
              </a>
            </li>
          )}
        </>
      );
    } else if (path === "/About") {
      return (
        <>
          <li className="navItem">
            <a href="/main" className="navLink">
              <AiFillHome className="icon" /> Main
            </a>
          </li>
          {userData && (
            <li className="navItem">
              <a href={`../MyPage?userId=${userData.uid}`} className="navLink">
                <CgProfile className="icon" /> MY Page
              </a>
            </li>
          )}
        </>
      );
    } else if (path === "/MyPage") {
      return (
        <>
          <li className="navItem">
            <a href="/main" className="navLink">
              <AiFillHome className="icon" /> Main
            </a>
          </li>
          <li className="navItem">
            <a href="/About" className="navLink">
              <CgProfile className="icon" /> About
            </a>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="navItem">
            <a href="/main" className="navLink">
              <AiFillHome className="icon" /> Main
            </a>
          </li>
          <div className="navItem">
            {userData && (
              <li className="navItem">
                <a
                  href={`../MyPage?userId=${userData.uid}`}
                  className="navLink"
                >
                  <CgProfile className="icon" /> MY Page
                </a>
              </li>
            )}
          </div>
        </>
      );
    }
  };
  const showNav = () => {
    setActive("navBar activeNavBar");
  };
  const closeNav = () => {
    setActive("navBar");
  };

  const handleSignout = () => {
    signOut(auth)
      .then((result) => {
        clearUserData();
        console.log("Logout:", userData);
        navigate("/");
      })
      .catch((error) => console.error(error));
  };
  return (
    <section className="navBarSection">
      <header className="header flex">
        <div className="logoDiv">
          <a href="/main" className="logo flex">
            <h1>
              <MdOutlineTravelExplore className="icon" />
              Tourism.
            </h1>
          </a>
        </div>
        <div className={active}>
          <ul className="navLists flex">
            {renderNav()}

            <button className="btn">
              <a href="/" onClick={handleSignout}>
                <BiLogOutCircle className="logout" /> LogOut
              </a>
            </button>
          </ul>

          <div className="closeNavBar" onClick={closeNav}>
            <RiCloseFill className="icon"></RiCloseFill>
          </div>
        </div>
        <div className="toggleNavBar" onClick={showNav}>
          <HiOutlineMenu className="icon"></HiOutlineMenu>
        </div>
      </header>
    </section>
  );
};

export default Nav;
