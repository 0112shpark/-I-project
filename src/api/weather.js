import React from "react";
let weatherinfo = [];
export const weather = () => {
  function dfsXyConv(code, v1, v2) {
    const { PI, tan, log, cos, pow, floor, sin, sqrt, atan, abs, atan2 } = Math;
    //
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기1준점 Y좌표(GRID)

    const DEGRAD = PI / 180.0;
    const RADDEG = 180.0 / PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = tan(PI * 0.25 + slat2 * 0.5) / tan(PI * 0.25 + slat1 * 0.5);
    sn = log(cos(slat1) / cos(slat2)) / log(sn);
    let sf = tan(PI * 0.25 + slat1 * 0.5);
    sf = (pow(sf, sn) * cos(slat1)) / sn;
    let ro = tan(PI * 0.25 + olat * 0.5);
    ro = (re * sf) / pow(ro, sn);
    const rs = {};
    let ra, theta;
    if (code === "toXY") {
      rs.lat = v1;
      rs.lon = v2;
      ra = tan(PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / pow(ra, sn);
      theta = v2 * DEGRAD - olon;
      if (theta > PI) theta -= 2.0 * PI;
      if (theta < -PI) theta += 2.0 * PI;
      theta *= sn;
      rs.x = floor(ra * sin(theta) + XO + 0.5);
      rs.y = floor(ro - ra * cos(theta) + YO + 0.5);
    } else {
      rs.x = v1;
      rs.y = v2;
      const xn = v1 - XO;
      const yn = ro - v2 + YO;
      ra = sqrt(xn * xn + yn * yn);
      if (sn < 0.0) ra = -ra;
      let alat = pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * atan(alat) - PI * 0.5;

      if (abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (abs(yn) <= 0.0) {
          theta = PI * 0.5;
          if (xn < 0.0) theta = -theta;
        } else theta = atan2(xn, yn);
      }
      const alon = theta / sn + olon;
      rs.lat = alat * RADDEG;
      rs.lon = alon * RADDEG;
    }
    return rs;
  }

  async function weatherApiCall(lat, lon) {
    const moment = require("moment");
    require("moment-timezone");

    const getBaseDateTime = (
      { minutes = 0, provide = 40 } = {},
      dt = Date.now()
    ) => {
      const pad = (n, pad = 2) => ("0".repeat(pad) + n).slice(-pad);
      const date = new Date(dt - provide * 60 * 1000); // provide분 전
      return {
        base_date:
          date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()),
        base_time: pad(date.getHours()) + pad(minutes),
      };
    };

    const url1 =
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

    const key =
      "VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D";

    moment.tz.setDefault("Asia/Seoul");
    // const date = moment().format("YYYYMMDD");
    const rs = dfsXyConv("toXY", lat, lon);
    // console.log(rs);
    const dataType = "JSON";

    // var ret = "";

    // url
    const all_url =
      url1 +
      "?serviceKey=" +
      key +
      "&dataType=" +
      dataType +
      "&base_date=" +
      getBaseDateTime().base_date +
      "&base_time=" +
      getBaseDateTime().base_time +
      "&nx=" +
      rs.x +
      "&ny=" +
      rs.y;

    try {
      const response = await window.fetch(all_url);
      //console.log(response)
      const data = await response.json();
      const final_data = await data["response"]["body"]["items"]["item"];
      // console.log("final:", final_data);
      //console.log(Object.keys(data));
      //console.log(data);
      weatherinfo.push(final_data);
      return final_data;
    } catch (error) {
      console.error(error);
    }
  }
  const resetweatherinfo = () => {
    weatherinfo = [];
  };
  return { weatherinfo, weatherApiCall, resetweatherinfo };
};
