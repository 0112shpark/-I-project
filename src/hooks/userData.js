import React, { useState } from "react";

export const useData = () => {
  const initialUserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};
  const [userData, setUserData] = useState(initialUserData);

  const clearUserData = () => {
    setUserData({});
  };

  return {
    userData,
    setUserData,
    clearUserData,
  };
};
