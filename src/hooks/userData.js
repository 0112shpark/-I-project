import { getAuth, signOut } from "@firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export const useData = () => {
  const initialUserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};
  const [userData, setUserData] = useState(initialUserData);
  const auth = getAuth();
  const navigate = useNavigate();
  const clearUserData = () => {
    setUserData({});
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
  return {
    userData,
    setUserData,
    clearUserData,
    handleSignout,
  };
};
