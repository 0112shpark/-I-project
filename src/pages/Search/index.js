import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import { GrLocation } from "react-icons/gr";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [item, setitem] = useState([]);
  const [data, setdata] = useState({});
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const searchTerm = query.get("q");
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
    window
      .fetch(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentTypeId=12&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&listYN=Y&arrange=A&areaCode=&sigunguCode=&cat1=&cat2=&cat3=&keyword=${searchTerm}&_type=json`
      )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const { response } = result;
        const { body } = response;
        const { items } = body;
        const { item } = items;
        setdata(item[0]);
        setitem(item);
        console.log("item", item);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchTerm]);

  const handleinput = (event) => {
    const value = event.target.value;
    setKeyword(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${keyword}`);
    }
  };

  const handlesearch = (e) => {
    navigate(`/search?q=${keyword}`);
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

        {item.map((data) => (
          <>
            <div className="itmes" key={data.contentid}>
              {data.firstimage ? (
                <img src={data.firstimage} alt={data.title} />
              ) : (
                <img src="/images/noimage.jpg" alt={data.title} />
              )}
              <h2>{data.title}</h2>
              <p>Address: {data.addr1}</p>
              <p>Area Code: {data.areacode}</p>
              <p>Category 1: {data.cat1}</p>
              <p>Category 2: {data.cat2}</p>
              <p>Category 3: {data.cat3}</p>
              <p>Content Type ID: {data.contenttypeid}</p>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default SearchPage;
