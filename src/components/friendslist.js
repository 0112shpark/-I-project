import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./friendslist.css";

const FriendList = () => {
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
          const friendIds = users[userId]?.friends || {};
          const friendUsernames = Object.keys(friendIds).map((friendId) => {
            return {
              uid: friendId,
              username: users[friendId]?.username || "",
            };
          });
          setUsernames(friendUsernames);
        }
      } catch (error) {
        console.log("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, [userId]);

  const handleUsernameClick = (uid, event) => {
    event.preventDefault();
    navigate(`/mypage?userId=${uid}`);
  };

  return (
    <div>
      <h2 style={{ marginLeft: "10px" }}>My Friends: </h2>
      <ul>
        {usernames.map(({ uid, username }, index) => (
          <li key={index} style={{ color: "black" }}>
            <a href="#" onClick={(event) => handleUsernameClick(uid, event)}>
              {username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
