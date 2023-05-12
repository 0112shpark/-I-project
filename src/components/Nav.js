import React from "react";
import "./Nav.css";
import { MdOutlineTravelExplore } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useData } from "../hooks/userData";

const Nav = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { userData, clearUserData } = useData({});

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
              Tourism
            </h1>
          </a>
        </div>
        <div className="navBar">
          <ul className="navLists flex">
            <li className="navItem">
              <a href="/MyPage" className="mypage">
                MY Page
              </a>
            </li>

            <button className="btn">
              <a href="/" className="mypage" onClick={handleSignout}>
                <BiLogOutCircle className="logout" /> LogOut
              </a>
            </button>
          </ul>

          <div className="closeNavBar">
            <AiOutlineClose className="icon"></AiOutlineClose>
          </div>
        </div>
        <div className="toggleNavBar">
          <FiMoreHorizontal className="icon"></FiMoreHorizontal>
        </div>
      </header>
    </section>
  );
};

export default Nav;
