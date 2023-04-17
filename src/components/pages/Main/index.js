import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

const MainPage = () => {
  //console.log("hello world");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signOut(auth)
      .then((result) => {
        //setUserData({});
        navigate("/");
      })
      .catch((error) => console.error(error));
  };
  return (
    <>
      <section className="container">
        <div className="main-container">
          <div>Login success!!</div>

          <div className="buttons__signout" onClick={handleSignout}>
            Logout
          </div>
          <div>Hello</div>
        </div>
      </section>
    </>
  );
};

export default MainPage;
