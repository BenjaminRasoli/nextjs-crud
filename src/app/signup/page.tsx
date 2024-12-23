"use client";
import React, { useContext, useState } from "react";
import "./styles/signUp.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";

function Page() {
  interface UserData {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    uid: string;
    date: string;
  }

  const router = useRouter();
  const { dispatch, currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    uid: "",
    date: new Date().toLocaleDateString(),
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    invalid: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      invalid: "",
    };

    if (!/^[A-Za-z]+$/.test(userData.firstName)) {
      newErrors.firstName = "First name should contain only letters.";
    }
    if (!/^[A-Za-z]+$/.test(userData.lastName)) {
      newErrors.lastName = "Last name should contain only letters.";
    }
    if (userData.userName.trim() === "") {
      newErrors.userName = "User name cannot be empty.";
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        password: userData.password,
        email: userData.email,
        uid: user.uid,
        date: new Date().toLocaleDateString(),
      });

      dispatch({
        type: "LOGIN",
        payload: {
          ...user,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
        },
      });
      router.push("/");
      setUserData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        uid: "",
        date: new Date().toLocaleDateString(),
      });
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        invalid: "Invalid credentials. Please try again.",
      }));
    }
  };

  const handleUserData = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <div>
      {!currentUser ? (
        <div className="container">
          <h1 style={{ color: "#cccaca" }}>Sign up</h1>
          <form onSubmit={handleLogin} className="signUpForm">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleUserData}
                maxLength={15}
              />
              {errors.firstName && (
                <span className="error">{errors.firstName}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleUserData}
                maxLength={15}
              />
              {errors.lastName && (
                <span className="error">{errors.lastName}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="userName"
                placeholder="User Name"
                value={userData.userName}
                onChange={handleUserData}
                maxLength={15}
              />
              {errors.userName && (
                <span className="error">{errors.userName}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleUserData}
                maxLength={25}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleUserData}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p style={{ color: "#cccaca" }}>
            Already have an account?
            <Link href={"/login"}>
              <span> Login</span>
            </Link>
          </p>
        </div>
      ) : (
        <div className="signup-text">You are already logged in.</div>
      )}
    </div>
  );
}

export default Page;
