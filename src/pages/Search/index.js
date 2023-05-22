import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import { GrLocation } from "react-icons/gr";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [item, setitem] = useState([]);
  const [option, setOption] = useState("");
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

    if (!contentid) {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    } else {
      URL = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentTypeId=${contentid}&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`;
    }
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [contentid, searchTerm]);

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
        <div className="destination">
          <div className="input flex">
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
          <div className="select-wrapper">
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
          "{searchTerm}"에 대한 {option}검색결과입니다.
        </div>
        <div className="search-results">
          {item.map((data) => (
            <div className="items" key={data.contentid}>
              {data.firstimage ? (
                <img src={data.firstimage} alt={data.title} />
              ) : (
                <img src="/images/noimage.jpg" alt={data.title} />
              )}
              <h2>{data.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
