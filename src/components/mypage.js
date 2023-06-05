import React, { useState, useEffect } from "react";
import video from "../videos/korea.mp4";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, update } from "firebase/database";
import {
  getStorage,
  ref as stRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useData } from "../hooks/userData";
import "./mypage.css";
import Nav from "./Nav";

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
  const [percent, setPercent] = useState(0);
  const [username, setUsername] = useState("");
  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [photo, setPhotoURL] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userData) {
      const userRef = database.ref(`users/${userId}`);
      userRef
        .once("value")
        .then((snapshot) => {
          const user = snapshot.val();
          if (user && user.photoUrl) {
            setPhotoURL(user.photoUrl);
          }
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });

      if (userId) {
        const friendRef = database.ref(
          `users/${userData.uid}/friends/${userId}`
        );
        friendRef
          .once("value")
          .then((snapshot) => {
            const isFriend = snapshot.exists();
            setIsFriendAdded(isFriend);
          })
          .catch((error) => {
            console.log("Error checking friend status:", error);
          });

        const userRef = database.ref(`users/${userId}`);
        userRef
          .once("value")
          .then((snapshot) => {
            const userData = snapshot.val();
            setUsername(userData.username);
          })
          .catch((error) => {
            console.log("Error fetching user data:", error);
          });
      }
    }
  }, [userData, userId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleChangePicture = () => {
    if (profilePicture) {
      const db = getDatabase();
      const storage = getStorage();
      const storageRef = stRef(storage, `photos/${userId}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((photoURL) => {
              console.log("Photo download URL:", photoURL);

              const userRef = ref(db, `users/${userId}`);
              update(userRef, { photoUrl: photoURL });
              window.location.reload();
            })

            .catch((error) => {
              console.log("Error getting photo download URL:", error);
            });
        }
      );
    }
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
                console.log("Friend removed successfully");
              })
              .catch((error) => {
                console.log("Error removing friend:", error);
              });
          } else {
            console.log("Friend does not exist");
          }
        })
        .catch((error) => {
          console.log("Error checking friend existence:", error);
        });
    } else {
      // Add friend to Firebase database
      const friendRef = database.ref(`users/${userData.uid}/friends/${userId}`);
      friendRef
        .set(true)
        .then(() => {
          setIsFriendAdded(true);
          console.log("Friend added successfully");
        })
        .catch((error) => {
          console.log("Error adding friend:", error);
        });
    }
  };

  const handleMyPage = () => {
    navigate(`../MyPage?userId=${userData.uid}`);
  };
  const handleSearchClick = () => {
    navigate(`../SearchFriend?userId=${searchQuery}`);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`../SearchFriend?userId=${searchQuery}`);
    }
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
      <div className="container1">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearchClick}>
            Search
          </button>
        </div>
        <div className="flex-container">
          <div className="image-container1">
            <img
              className="img"
              src={photo}
              alt={userId && userId.displayName}
            />
          </div>
          <div className="change-picture">
            {userId == userData?.uid && (
              <div className="upload-container">
                <input
                  type="file"
                  onChange={handleChange}
                  accept="image/*"
                  className="file-input"
                />
                {profilePicture && (
                  <button
                    className={`custom-button`}
                    onClick={handleChangePicture}
                  >
                    Change Profile Picture
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="info-container">
            {userId !== userData?.uid && (
              <div className="button-container">
                <button
                  className={`custom-button ${
                    isFriendAdded ? "friend-added-button" : "add-friend-button"
                  }`}
                  onClick={handleAddFriend}
                >
                  {isFriendAdded ? "Friend Added" : "Add Friend"}
                </button>
                <button
                  className="custom-button add-friend"
                  onClick={handleMyPage}
                >
                  My Profile
                </button>
              </div>
            )}
            {username && (
              <p className="username">
                UserName: <br></br>
                {username}
              </p>
            )}
          </div>
          <div>
            <a
              href="#"
              onClick={(event) => handleFriendsClick(userId, event)}
              className="link"
            >
              Friends
            </a>
          </div>
          <a
            href="#"
            onClick={(event) => handleFavoritesClick(userId, event)}
            className="link"
          >
            Favorites
          </a>
        </div>
      </div>
    </section>
  );
};

export default Mypage;
