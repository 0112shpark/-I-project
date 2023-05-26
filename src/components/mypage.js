import React from "react";
import { useState, useEffect } from "react";
import video from "../videos/korea.mp4";
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useLocation, useNavigate } from "react-router-dom";

import { useData } from "../hooks/userData";
import "./mypage.css";

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

const Mypage = () => {
  const { userData } = useData({});
  const [username, setUsername] = useState("");
  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userId) {
      const friendRef = database.ref(`users/${userData.uid}/friends/${userId}`);
      friendRef
        .once("value")
        .then((snapshot) => {
          const isFriend = snapshot.exists();
          setIsFriendAdded(isFriend);
        })
        .catch((error) => {
          console.log("Error checking friend status:", error);
        });

      const userRef = database.ref(`users/${userId}/username`);
      userRef
        .once("value")
        .then((snapshot) => {
          const username = snapshot.val();
          setUsername(username);
        })
        .catch((error) => {
          console.log("Error fetching username:", error);
        });
    }
  }, [userId, userData.uid]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddFriend = () => {
    if (isFriendAdded) {
      // Remove friend from Firebase database
      const friendRef = database.ref(`users/${userData.uid}/friends/${userId}`);
      friendRef
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            friendRef
              .remove()
              .then(() => {
                setIsFriendAdded(false);
                console.log('Friend removed successfully');
              })
              .catch((error) => {
                console.log('Error removing friend:', error);
              });
          } else {
            console.log('Friend does not exist');
          }
        })
        .catch((error) => {
          console.log('Error checking friend existence:', error);
        });
    } else {
      // Add friend to Firebase database
      const friendRef = database.ref(`users/${userData.uid}/friends/${userId}`);
      friendRef
        .set(true)
        .then(() => {
          setIsFriendAdded(true);
          console.log('Friend added successfully');
        })
        .catch((error) => {
          console.log('Error adding friend:', error);
        });
    }
  };

  const handleSearchClick = () => {
    navigate(`../SearchFriend?userId=${searchQuery}`);
  };

  const handleFriendsClick = (uid, event) => {
    event.preventDefault();
    navigate(`/friendslist?userId=${uid}`);
  };
  const handleFavoritesClick = (uid, event) => {
    event.preventDefault();
    navigate(`/favorites?userId=${uid}`);
  };

  return (
    <section className="mypage">
      <div className="overlay1"></div>
      <div className="container1">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <p className="search-text" onClick={handleSearchClick}>
            Search
          </p>
        </div>
        <div className="flex-container">
          <div className="image-container">
            <img
              className="img"
              src={userData && userData.photoURL}
              alt={userData && userData.displayName}
            />
          </div>
          <div className="info-container">
            {userId !== userData?.uid && (
              <div className="button-container">
                <button
                  className="custom-button"
                  onClick={handleAddFriend}
                >
                  {isFriendAdded ? "Friend Added" : "Add Friend"}
                </button>
              </div>
            )}
            {username && <p style={{ fontWeight: "bold" }}>{username}</p>}
          </div>
          <div>
          <a href="#" onClick={(event) => handleFriendsClick(userData?.uid, event)}>
            My Friends
          </a>
          </div>
          <a href="#" onClick={(event) => handleFavoritesClick(userData?.uid, event)}>
            Favorites
          </a>
        </div>
      </div>
    </section>
  );
};

export default Mypage;

