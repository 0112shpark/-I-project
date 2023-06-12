import React, { useState } from "react";
import video from "../videos/korea.mp4";
import "./search.css";
import { HiSearch } from "react-icons/hi";
import { BiBus } from "react-icons/bi";
import { TbTrain } from "react-icons/tb";
import { AiOutlineGithub } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [option, setOption] = useState("");
  const navigate = useNavigate();

  const handleinput = (event) => {
    const value = event.target.value;
    setKeyword(value);
  };

  const handleOption = (event) => {
    setOption(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // setSearchValue(e.target.value);
      // console.log(searchValue);
      navigate(`/search?q=${keyword}&id=${option}`);
    }
  };

  const handlesearch = (e) => {
    navigate(`/search?q=${keyword}&id=${option}`);
  };

  return (
    <section className="search">
      <div className="overlay1"></div>
      <video src={video} muted autoPlay loop></video>

      <div className="searchContent Wrapper">
        <div className="textDiv">
          <h1 className="searchTitle">
            오늘은 <br></br>어디로 가볼까요?
          </h1>
        </div>
        <div className="cardDiv grid">
          <div className="destination">
            <label htmlFor="dest">목적지를 입력해주세요:</label>
            <div className="input flex">
              <input
                type="text"
                placeholder="ex) 경복궁"
                value={keyword}
                onChange={handleinput}
                onKeyDown={handleKeyDown}
              />
              <HiSearch className="icon" onClick={handlesearch} />
            </div>
          </div>
          <div className="option">
            <label htmlFor="input flex">카테고리를 선택해주세요:</label>
            <div className="select-wrapper">
              <select value={option} onChange={handleOption}>
                <option value="">-- 전체검색 --</option>
                <option value="12">관광지</option>
                <option value="14">문화시설</option>
                <option value="15">행사/공연/축제</option>
                <option value="25">여행코스</option>
                <option value="28">레포츠</option>
                <option value="32">숙박</option>
                <option value="38">쇼핑</option>
                <option value="39">음식점</option>
              </select>
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
