import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/userData";
import "./Main.css";
// import Nav from "../../components/Nav";

const MainPage = () => {
  //console.log("hello world");

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
    <>
      <section className="container">
        <div className="main-container">
          <div>Login success!!</div>
          <img
            className="userimg"
            src={userData.photoURL}
            alt={userData.displayName}
          />
          <div className="buttons__signout" onClick={handleSignout}>
            Logout
          </div>
          <div>Hello</div>
        </div>
      </section>
    </>
  );
};

export default MainPage;
