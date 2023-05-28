import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/userData";
import "./main.css";
import Nav from "../../components/Nav";
import Friendslist from "../../components/friendslist";

const FriendsList = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { userData, clearUserData } = useData({});

  const handleSignout = () => {
    signOut(auth)
      .then((result) => {
        clearUserData();

        navigate("/");
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="container">
      <Nav />
      <Friendslist />
    </div>
  );
};

export default FriendsList;
