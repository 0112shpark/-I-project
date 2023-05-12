import React from "react";
import video from "../videos/korea.mp4";
import "./search.css";
import { GrLocation } from "react-icons/gr";
import { BiBus } from "react-icons/bi";
import { TbTrain } from "react-icons/tb";
import { AiOutlineGithub } from "react-icons/ai";
const Search = () => {
  return (
    <section className="search">
      <div className="overlay1"></div>
      <video src={video} muted autoPlay loop type="video/mp4"></video>

      <div className="searchContent Wrapper">
        <div className="textDiv">
          <span className="smallText">Tour</span>
          <h1 className="searchTitle">Search your Tour Destination</h1>
        </div>
        <div className="cardDiv grid">
          <div className="destination">
            <label htmlFor="dest">Search your destination:</label>
            <div className="input flex">
              <input type="text" placeholder="Enter name here..." />
              <GrLocation className="icon" />
            </div>
          </div>
          <div className="option2">
            <label htmlFor="op2">Second option</label>
            <div className="input flex">
              <input type="text" placeholder="Option 2" />
              <GrLocation className="icon" />
            </div>
          </div>
        </div>

        <div className="footerIcons flex">
          <div className="rightIcons">
            <a href="https://www.kobus.co.kr/main.do">
              <BiBus className="icon1" />
            </a>
            <a href="https://www.letskorail.com/">
              <TbTrain className="icon1" />
            </a>
          </div>
          <div className="leftIcons">
            <a href="https://github.com/0112shpark/-I-project">
              <AiOutlineGithub className="icon1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
