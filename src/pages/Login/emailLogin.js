import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";

const emailLogin = (Email, Password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, Email, Password)
    .then((userCredential) => {
      var user = userCredential.user;

      // 로그인 성공 후 처리할 코드 작성

      //setUserData(user);
      user.photoURL =
        "https://img.etoday.co.kr/pto_db/2014/07/600/20140716083334_480290_1476_739.jpg";
      console.log("Logged in user:", user);
      localStorage.setItem("userData", JSON.stringify(user));
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          alert("The email address is not valid.");
          break;
        case "auth/user-disabled":
          alert("The user account has been disabled.");
          break;
        case "auth/user-not-found":
          alert("There is no user corresponding to the given email.");
          break;
        case "auth/wrong-password":
          alert("The password is invalid.");
          break;
        default:
          alert("An error occurred while logging in.");
          break;
      }
    });
};

export default emailLogin;
