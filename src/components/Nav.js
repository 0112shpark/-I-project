import React, { useState } from "react";
import "./Nav.css";
import { MdOutlineTravelExplore } from "react-icons/md";
import { RiCloseFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useData } from "../hooks/userData";

const Nav = () => {
  const [active, setActive] = useState("navBar");
  const auth = getAuth();
  const navigate = useNavigate();
  const { userData, clearUserData } = useData({});

  //toggle

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
            <li className="navItem">
              <a href="/MyPage" className="navLink">
                MY Page
              </a>
            </li>

            <button className="btn">
              <a href="/" className="navLink" onClick={handleSignout}>
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
