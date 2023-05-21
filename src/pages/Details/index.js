import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./main.css";

const DetailsPage = () => {
  const { contentid, contenttypeid } = useParams();
  const [details, setDetails] = useState({});
  useEffect(() => {
    window
    .fetch(
      `https://apis.data.go.kr/B551011/KorService1/detailIntro1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&contentId=${contentid}&contentTypeId=${contenttypeid}&_type=json`
      )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      const { response } = result;
      const { body } = response;
      const { items } = body;
      const { item } = items;
      setDetails(item[0]);
      console.log("item", details);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [contenttypeid, contentid]);
  
  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{details.firstmenu}</h2>
      <p>{details.contentid}</p>
      {/* Render additional details */}
    </div>
  );
  };
  
  export default DetailsPage;