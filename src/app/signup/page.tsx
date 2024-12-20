"use client";
import React, { useContext, useState } from "react";
import "./styles/signUp.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

function page() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/");
        dispatch({ type: "LOGIN", payload: user });
        setEmail("");
        setpassword("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container">
        <h1>Sign up</h1>
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
            onChange={(e) => setpassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          already have an account
          <Link href={"/login"}>
            <span> login</span>
          </Link>
        </p>
      </div>
    </>
  );
}

export default page;
