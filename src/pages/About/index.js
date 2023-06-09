import React from "react";
import "./main.css";
import Nav from "../../components/Nav";

const About = () => {
  return (
    <div className="container_about">
      <Nav></Nav>
      <div className="about_top">
        <div className="about_box1">
          <img src="/images/logo.png" alt="logo" className="about-logo" />
        </div>
        <div className="about_box2">Team 자반고등어</div>
        <div className="about_box3">
          K-Discovery 어플리케이션은 여러 관광명소 정보를 종합적으로 사용자에게
          안내하는 챗봇 가이드로 사용자가 여행지 정보를 취합하고 계획 수립에
          도움을 줄 수 있습니다
        </div>
        <div className="about_box4">자반고등어와 함께 즐거운 여행 되세요!</div>
      </div>
    </div>
  );
};

export default About;
