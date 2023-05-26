import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import "./favorites.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const snapshot = await firebase.database().ref(`users/${userId}/favorites`).once("value");
        const favoritesData = snapshot.val();
        if (favoritesData) {
          const favoritesList = Object.values(favoritesData);
          setFavorites(favoritesList);
        }
      } catch (error) {
        console.log('Error fetching favorites:', error);
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
      <h2 style={{ marginLeft: "10px" }}>Favorites: </h2>
      <div className="favorites-list">
        {favorites.map((favorite, index) => (
          <div key={index} className="favorite-item">
            <img src={favorite.image} alt={favorite.title} />
            <span>{favorite.title}</span>
            <FaMapMarkerAlt
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => handleMapMarkerClick(favorite.title)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
