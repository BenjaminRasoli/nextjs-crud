"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles/login.scss";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

function Page() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("test@gmail.com");
  const [password, setPassword] = useState<string>("123456");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        setEmail("");
        setPassword("");
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="loginForm">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        don't have an account{" "}
        <Link href={"/signup"}>
          <span> Sign Up</span>
        </Link>
      </p>
    </div>
  );
}

export default Page;
