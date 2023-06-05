import React from "react";
import { useNavigate } from "react-router-dom";
import "./goback.css";
import { IoIosArrowBack } from "react-icons/io";

const Goback = () => {
  const navigate = useNavigate();
  return (
    <button
      className="go-back"
      onClick={() => {
        navigate(-1);
      }}
    >
      <IoIosArrowBack className="icon" />
    </button>
  );
};

export default Goback;
