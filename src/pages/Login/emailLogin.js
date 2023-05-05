import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";

const emailLogin = (Email, Password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, Email, Password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in user:", user);
      // 로그인 성공 후 처리할 코드 작성
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
