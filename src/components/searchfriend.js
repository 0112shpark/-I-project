import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./searchfriend.css";

const SearchFriend = () => {
  const [usernames, setUsernames] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const snapshot = await firebase.database().ref("users").once("value");
        const users = snapshot.val();
        if (users) {
          const usernames = Object.entries(users).map(([uid, user]) => ({
            uid,
            username: user.username,
          }));
          setUsernames(usernames);
        }
      } catch (error) {
        console.log("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);

  // Filter usernames based on userId
  const filteredUsernames = usernames.filter((user) => {
    const regex = new RegExp(userId, "i"); // "i" flag for case-insensitive matching
    return regex.test(user.username);
  });

  const handleUsernameClick = (uid, event) => {
    event.preventDefault();
    navigate(`/mypage?userId=${uid}`);
  };

  return (
    <div className="usernames-container">
      <h2 className="usernames-header">"{userId}" 에 대한 검색결과입니다.</h2>
      <ul className="usernames-list">
        {filteredUsernames.map(({ uid, username }, index) => (
          <li key={index} className="username-item">
            <div
              onClick={(event) => handleUsernameClick(uid, event)}
              className="username-box"
            >
              {username}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFriend;
