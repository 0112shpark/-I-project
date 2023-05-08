import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";

import React from "react";

const SignUp = (Email, Password, UserName) => {
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, Email, Password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up successfully:", user);
      alert("Successfully signed up");

      // add to database
      const userId = auth.currentUser.uid;
      const db = getDatabase();
      set(ref(db, "users/" + userId), {
        username: UserName,
        email: Email,
        friends: "0",
      });
      set(ref(db, "friends/" + userId));
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("The email address is already in use");
      } else if (error.code === "auth/invalid-email") {
        alert("The email address is not valid.");
      } else if (error.code === "auth/operation-not-allowed") {
        alert("Operation not allowed.");
      } else if (error.code === "auth/weak-password") {
        alert("The password is too weak.");
      }
    });
};
export default SignUp;
