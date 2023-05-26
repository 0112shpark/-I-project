import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { BsFillSunFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

import { FiLoader } from "react-icons/fi";
import { weather } from "../../api/weather";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const { weatherinfo, weatherApiCall, resetweatherinfo } = weather({});
  const [item, setitem] = useState([]);
  // const [category, set] = useState("전체");
  const [option, setOption] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const searchTerm = query.get("q");
  const contentid = query.get("id");
  const [currentPage, setCurrentPage] = useState(1);
  let pageNo = 1;

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

    let item_weather = [];

    let length = 0;
    if (!contentid) {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=${currentPage}&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    } else {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=${currentPage}&MobileOS=ETC&MobileApp=AppTest&contentTypeId=${contentid}&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    }
    setIsloading(true);
    window
      .fetch(URL)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const { response } = result;
        const { body } = response;
        const { totalCount } = body;
        setTotalPages(Math.ceil(totalCount / 10));
        console.log(totalPages);
        const { items } = body;
        const { item } = items;
        item_weather = item;
        setitem(item);
        if (item == null) {
          return Promise.reject(new Error("No items found.")); // Return a rejected Promise to exit the chain
        }
        length = item_weather.length;

        console.log("item", item);
      })
      .then(() => {
        const weather = []; // Array to store promises
        resetweatherinfo();
        for (var i = 0; i < length; i++) {
          weather[i] = weatherApiCall(
            item_weather[i].mapy,
            item_weather[i].mapx
          );
        }

        // Wait for all promises to resolve
        Promise.all(weather).then(() => {
          // All promises resolved
          console.log("Weather API calls completed");
          console.log(weatherinfo);

          //add weather to item
          for (var i = 0; i < length; i++) {
            item_weather[i].rain = weatherinfo[i][0].obsrValue;
            item_weather[i].humid = weatherinfo[i][1].obsrValue;
            item_weather[i].temperature = weatherinfo[i][3].obsrValue;
          }
          console.log("weather added:", item_weather);
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsloading(false); // Set isLoading to false after data fetching is complete (success or error)
      });
    setIsloading(false);
  }, [contentid, isloading, searchTerm, currentPage]);

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
    resetweatherinfo();
    if (event.key === "Enter") {
      navigate(`/search?q=${keyword}&id=${option}`);
    }
  };

  const handlesearch = (e) => {
    resetweatherinfo();
    navigate(`/search?q=${keyword}&id=${option}`);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 5; // Number of page numbers to show at a time
    const halfVisibleCount = Math.floor(visiblePageCount / 2);
    let startPage = currentPage - halfVisibleCount;

    if (startPage < 1) {
      startPage = 1;
    }

    let endPage = startPage + visiblePageCount - 1;
    // console.log(startPage, endPage, totalPages);

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - visiblePageCount + 1;
      if (startPage < 1) {
        startPage = 1;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    // console.log("page:", pageNumbers);
    return pageNumbers;
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
            <HiSearch className="icon" onClick={handlesearch} />
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

        <div className="pagination">
          <button
            className="arrow"
            disabled={currentPage === 1}
            onClick={handlePrevPageClick}
          >
            ◀
          </button>
          <div className="page-numbers">{renderPageNumbers()}</div>
          <button
            className="arrow"
            disabled={currentPage === totalPages} // Replace 'totalPages' with the actual total number of pages in your data
            onClick={handleNextPageClick}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
