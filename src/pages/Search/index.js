import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import { GrLocation } from "react-icons/gr";
import { BsFillSunFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { FaSadTear } from "react-icons/fa";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [item, setitem] = useState([]);
  // const [category, set] = useState("전체");
  const [option, setOption] = useState("");
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const searchTerm = query.get("q");
  const contentid = query.get("id");

  useEffect(() => {
    //contentstypeID
    // 12 => 관광지
    // 14 => 문화시설
    // 15 => 행사/공연/축제
    // 25 => 여행코스
    // 28 => 레포츠
    // 32 => 숙박
    // 38 => 쇼핑
    // 39 => 음식점
    let URL;
    setitem([]);

    if (!contentid) {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    } else {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentTypeId=${contentid}&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    }
    setIsloading(true);
    window
      .fetch(URL)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const { response } = result;
        const { body } = response;
        const { items } = body;
        const { item } = items;
        setitem(item);
        console.log("item", item);
        console.log("loading", isloading);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsloading(false); // Set isLoading to false after data fetching is complete (success or error)
      });
    setIsloading(false);
  }, [contentid, isloading, searchTerm]);

  const handlecategory = () => {
    switch (contentid) {
      case "12":
        return "관광지";

      case "14":
        return "문화시설";

      case "15":
        return "행사/공연/축제";

      case "25":
        return "여행코스";

      case "28":
        return "레포츠";

      case "32":
        return "숙박";

      case "38":
        return "쇼핑";

      case "39":
        return "음식점";

      default:
    }
    switch (option) {
      case "12":
        return "관광지";

      case "14":
        return "문화시설";

      case "15":
        return "행사/공연/축제";

      case "25":
        return "여행코스";

      case "28":
        return "레포츠";

      case "32":
        return "숙박";

      case "38":
        return "쇼핑";

      case "39":
        return "음식점";

      default:
    }
    return "전체";
  };

  const handleinput = (event) => {
    const value = event.target.value;
    setKeyword(value);
  };
  const handleOption = (event) => {
    setOption(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${keyword}&id=${option}`);
    }
  };

  const handlesearch = (e) => {
    navigate(`/search?q=${keyword}&id=${option}`);
  };

  return (
    <>
      <div className="container">
        <Nav></Nav>
        <div className="search-destination">
          <div className="search-input">
            <input
              type="text"
              placeholder="Enter name here..."
              value={keyword}
              onChange={handleinput}
              onKeyDown={handleKeyDown}
            />
            <GrLocation className="icon" onClick={handlesearch} />
          </div>
        </div>
        <div className="option2">
          <div className="search-wrapper">
            <select value={option} onChange={handleOption}>
              <option value="">--Please choose an option--</option>
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
        <div className="search-topics">
          "{searchTerm}"에 대한 {handlecategory()} 검색 결과입니다.
        </div>
        <div className="search-results">
          {isloading ? (
            <div className="loading">
              <FiLoader className="icon"></FiLoader>
            </div>
          ) : item ? (
            item.map((data) => (
              <div className="items" key={data.contentid}>
                {data.firstimage ? (
                  <img
                    src={data.firstimage}
                    className="firstimage"
                    alt={data.title}
                  />
                ) : (
                  <img
                    src="/images/noimage.jpg"
                    className="firstimage"
                    alt={data.title}
                  />
                )}
                <div className="item-details">
                  <h2 className="titles">{data.title}</h2>
                  <div className="item-icons">
                    <div className="icons">
                      <AiOutlineHeart className="icon heart"></AiOutlineHeart>
                      <BsFillSunFill className="icon"></BsFillSunFill>
                      <BsFillSunFill className="icon"></BsFillSunFill>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <img className="sad-tear" src="/images/sad.gif" alt="sad"></img>"
              {searchTerm}"에 대한 {handlecategory()} 검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
