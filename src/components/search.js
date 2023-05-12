import React from "react";
import video from "../videos/sea-6399.mp4";
const Search = () => {
  return (
    <section className="search">
      <div className="overlay"></div>
      <video src={video} muted autoPlay loop type="video/mp4"></video>
    </section>
  );
};

export default Search;
