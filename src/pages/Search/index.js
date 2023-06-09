import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import "./main.css";
import { useLocation, useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { BsFillPeopleFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";

import { FiLoader } from "react-icons/fi";
import { weather } from "../../api/weather";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useData } from "../../hooks/userData";
import { Link } from "react-router-dom";
import Modalopen from "../../components/modalopen";

const firebaseConfig = {
  apiKey: "AIzaSyAHcapNthGtxiWfwLqFJ-lAaixYIHNhDdw",
  authDomain: "jaban-7c8c2.firebaseapp.com",
  databaseURL: "https://jaban-7c8c2-default-rtdb.firebaseio.com",
  projectId: "jaban-7c8c2",
  storageBucket: "jaban-7c8c2.appspot.com",
  messagingSenderId: "862801813260",
  appId: "1:862801813260:web:4a8e0911e28ed43cd5b329",
  measurementId: "G-B6Q439LLL4",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const friendFavorites = [];
const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const { weatherinfo, weatherApiCall, resetweatherinfo } = weather({});
  const [item, setitem] = useState([]);
  const { userData } = useData({});
  // const [category, set] = useState("전체");
  const [option, setOption] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const [modal, setModal] = useState(false);
  const [usernames, setUsernames] = useState([]);

  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const searchTerm = query.get("q");
  const contentid = query.get("id");
  const userId = query.get("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);
  const [render, setRender] = useState("");
  const [updatestat, setUpdatestat] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [error, setError] = useState(false);

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

    const loadFavorites = () => {
      const ref = database.ref(`users/${userData.uid}/favorites`);
      ref.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const favorites = snapshot.val();
          const contentIds = Object.keys(favorites);
          setFavoriteItems(contentIds);
        } else {
          setFavoriteItems([]);
        }
      });
    };

    const likedByFriends = () => {
      const ref = database.ref(`users/${userData.uid}/friends`);
      ref.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const friends = snapshot.val();
          const friendIds = Object.keys(friends);

          friendIds.forEach((friendId) => {
            const favoritesRef = database.ref(`users/${friendId}/favorites`);
            const usernameRef = database.ref(`users/${friendId}/username`);

            usernameRef.once("value", (usernameSnapshot) => {
              if (usernameSnapshot.exists()) {
                const username = usernameSnapshot.val();
                favoritesRef.once("value", (favoritesSnapshot) => {
                  if (favoritesSnapshot.exists()) {
                    const favorites = favoritesSnapshot.val();
                    const favoriteIds = Object.keys(favorites);
                    friendFavorites.push({ friendId, favoriteIds, username });
                  }
                });
              }
            });
          });

          console.log(friendFavorites);
          setTimeout(() => {
            console.log(
              "Friend Ids, Favorite Ids, and Usernames:",
              friendFavorites
            );
          }, 1000);
        }
      });
    };
    loadFavorites();
    likedByFriends();
    let URL;
    setitem([]);
    setRender("날씨 정보 받아오는 중...");
    setUpdatestat(false);
    setError(false);
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
        const { totalCount, items } = body;

        // const { items } = body;
        const { item } = items;
        item_weather = item;
        setTotalPages(Math.ceil(totalCount / 10));
        setitem(item);
        if (item == null) {
          setUpdatestat(true);
          setTotalPages(1);
          setError(true);
          setRender("받아올 수 있는 정보가 없습니다.");
          return Promise.reject(new Error("No items found.")); // Return a rejected Promise to exit the chain
        }
        length = item_weather.length;

        console.log("item", item);
      })
      .then(async function () {
        //TODO: need to handle a case when mapx, mapy is 0
        const weather = []; // Array to store promises

        for (var i = 0; i < length; i++) {
          weather[i] = await weatherApiCall(
            item_weather[i].mapy,
            item_weather[i].mapx
          );
        }

        // Wait for all promises to resolve
        Promise.all(weather).then(() => {
          // All promises resolved
          console.log("Weather API calls completed");
          console.log("weather info:", weatherinfo);

          //add weather to item
          for (var i = 0; i < length; i++) {
            // 0 = sun
            // 1 = rain
            // 2 = rainsnow
            // 3 = snow
            // 5 = rain
            // 6 = rainsnow
            // 7 = snow
            if (weatherinfo[i] === null) {
              item_weather[i].rain = "/images/unknown.png";

              continue;
            }
            switch (weatherinfo[i][0].obsrValue) {
              case "0":
                item_weather[i].rain = "/images/sun.png";
                break;
              case "1":
                item_weather[i].rain = "/images/rain.png";
                break;
              case "2":
                item_weather[i].rain = "/images/rainsnow.png";
                break;
              case "3":
                item_weather[i].rain = "/images/snowpng";
                break;
              case "5":
                item_weather[i].rain = "/images/rain.png";
                break;
              case "6":
                item_weather[i].rain = "/images/rainsnow.png";
                break;
              case "7":
                item_weather[i].rain = "/images/snow.png";
                break;
              default:
                item_weather[i].rain = "/images/unkown.png";
                break;
            }

            item_weather[i].humid = weatherinfo[i][1].obsrValue;
            item_weather[i].temperature = weatherinfo[i][3].obsrValue;
          }

          setitem(item_weather);
          console.log("weather added:", item_weather);
          setRender("날씨 정보 업데이트 완료!");
          setUpdatestat(true);
          setKeyword(searchTerm);
          resetweatherinfo();
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // setRender(true);
        setIsloading(false); // Set isLoading to false after data fetching is complete (success or error)
      });
    setIsloading(false);
  }, [contentid, searchTerm, currentPage]);

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

  const toggleFavorite = (contentId, data) => {
    if (favoriteItems.includes(contentId)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== contentId));
      database.ref(`users/${userData.uid}/favorites/${contentId}`).remove();
    } else {
      setFavoriteItems([...favoriteItems, contentId]);
      const itemData = {
        title: data.title,
        image: data.firstimage,
      };
      database
        .ref(`users/${userData.uid}/favorites/${contentId}`)
        .set(itemData);
    }
  };

  const isFavorite = (contentId) => {
    return favoriteItems.includes(contentId);
  };

  const handleinput = (event) => {
    const value = event.target.value;
    setKeyword(value);
  };
  const handleOption = (event) => {
    setOption(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && updatestat) {
      resetweatherinfo();
      navigate(`/search?q=${keyword}&id=${option}`);
      setCurrentPage(1);
      setitem([]);
    }
  };

  const handlesearch = (e) => {
    if (updatestat) {
      resetweatherinfo();
      navigate(`/search?q=${keyword}&id=${option}`);
      setCurrentPage(1);
      setitem([]);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    containerRef.current.scrollIntoView({ behavior: "smooth" });
    resetweatherinfo();
    setitem([]);
  };

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setitem([]);
    resetweatherinfo();
    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleMapMarkerClick = (title) => {
    const searchQuery = encodeURIComponent(title);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    resetweatherinfo();
    setitem([]);
    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 5;
    const halfVisibleCount = Math.floor(visiblePageCount / 2);
    let startPage = currentPage - halfVisibleCount;

    if (startPage < 1) {
      startPage = 1;
    }

    let endPage = startPage + visiblePageCount - 1;

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
          disabled={error || !updatestat}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="container">
        <Nav></Nav>
        <div className="search-destination" ref={containerRef}>
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
        {
          <div className={`updatestatus ${updatestat ? "done" : " "}`}>
            {render}
          </div>
        }
        <div className="search-topics">
          "{searchTerm}"에 대한 {handlecategory()} 검색 결과입니다.
        </div>
        <div className="search-results">
          {updatestat ? (
            item ? (
              item.map((data) => (
                <div className="items" key={data.contentid}>
                  {data.firstimage ? (
                    <img
                      src={data.firstimage}
                      className="firstimage"
                      alt={data.title}
                      onClick={() => {
                        navigate(
                          `/chat?id=${userData.uid}&contentid=${data.contentid}&contenttypeid=${data.contenttypeid}&locationName=${data.title}`
                        );
                      }}
                    />
                  ) : (
                    <img
                      src="/images/noimage.jpg"
                      className="firstimage"
                      alt={data.title}
                      onClick={() => {
                        navigate(
                          `/chat?id=${userData.uid}&contentid=${data.contentid}&contenttypeid=${data.contenttypeid}&locationName=${data.title}`
                        );
                      }}
                    />
                  )}
                  <div className="item-details">
                    <h2 className="titles">
                      <Link
                        to={`/chat?id=${userData.uid}&contentid=${data.contentid}&contenttypeid=${data.contenttypeid}&locationName=${data.title}`}
                      >
                        {data.title}
                      </Link>
                    </h2>
                    <div className="item-icons">
                      <div className="icons">
                        <img
                          className="weather1-stat"
                          src={data.rain}
                          alt="rain"
                        ></img>
                        <div className="weather-wrapper">
                          <img
                            className="weather1"
                            src="/images/temp.png"
                            alt="temp"
                          ></img>
                          <div className="temperature">
                            {" "}
                            {data.temperature}°C
                          </div>
                        </div>
                        <div className="weather-wrapper">
                          <img
                            className="weather1"
                            src="/images/humidity.png"
                            alt="humidity"
                          ></img>
                          <div className="humidity"> {data.humid}%</div>
                        </div>
                        <div className="likes">
                          {isFavorite(data.contentid) ? (
                            <AiFillHeart
                              className="icon heart filled"
                              onClick={() =>
                                toggleFavorite(data.contentid, data)
                              }
                            />
                          ) : (
                            <AiOutlineHeart
                              className="icon heart"
                              onClick={() =>
                                toggleFavorite(data.contentid, data)
                              }
                            />
                          )}
                          <BsFillPeopleFill
                            className="icon people"
                            onClick={() => {
                              const filteredUsernames = friendFavorites
                                .filter((friend) =>
                                  Object.values(friend.favoriteIds).includes(
                                    data.contentid
                                  )
                                )
                                .map((friend) => friend.username);
                              setUsernames(filteredUsernames);
                              setModal(true);
                            }}
                          />
                          <div className="location">
                            <FaMapMarkerAlt
                              className="map-marker"
                              onClick={() => handleMapMarkerClick(data.title)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <img className="sad-tear" src="/images/sad.gif" alt="sad"></img>
                "{searchTerm}"에 대한 {handlecategory()} 검색 결과가 없습니다.
              </div>
            )
          ) : (
            <div className="loading">
              <img
                className="loading"
                src="/images/loading.gif"
                alt="load"
              ></img>
            </div>
          )}
          {modal && <Modalopen setModal={setModal} usernames={usernames} />}
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
            disabled={currentPage === totalPages || !updatestat}
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
