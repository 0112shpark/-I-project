import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./friendslist.css";

const FriendList = () => {
  const [usernames, setUsernames] = useState([]);
  const [myname, setMyname] = useState("");
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
          const snapshot1 = await firebase
            .database()
            .ref(`users/${userId}/username`)
            .once("value");
          const user = snapshot1.val();
          if (user) {
            const val = Object.values(user);
            setMyname(val);
          }
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
    <div className="friends-container">
      <div className="friends-section">
        <h2 className="friends-heading">"{myname}"님의 친구목록입니다.</h2>
        <ul className="friends-list">
          {usernames.map(({ uid, username }, index) => (
            <li key={index} className="friend-item">
              <div className="friend-box">
                <a
                  href="#"
                  onClick={(event) => handleUsernameClick(uid, event)}
                  className="friend-link"
                >
                  {username}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
