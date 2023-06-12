import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./favorites.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`users/${userId}/favorites`)
          .once("value");
        const favoritesData = snapshot.val();
        if (favoritesData) {
          const favoritesList = Object.values(favoritesData);
          setFavorites(favoritesList);
        }
        const snapshot1 = await firebase
          .database()
          .ref(`users/${userId}/username`)
          .once("value");
        const users = snapshot1.val();
        if (users) {
          const val = Object.values(users);
          setUsername(val);
        }
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleMapMarkerClick = (title) => {
    const searchQuery = encodeURIComponent(title);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-heading">"{username}"님의 좋아요 목록입니다.</h2>
      <div className="favorites-list">
        {favorites.map((favorite, index) => (
          <div key={index} className="favorite-item">
            <div className="favorite-box">
              <img
                src={favorite.image ? favorite.image : "/images/noimage.jpg"}
                alt={favorite.title}
                className="favorite-image"
              />

              <span className="favorite-title">{favorite.title}</span>
              <FaMapMarkerAlt
                className="map-marker"
                onClick={() => handleMapMarkerClick(favorite.title)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
