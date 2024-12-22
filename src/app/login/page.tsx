"use client";
import React, { useContext, useState } from "react";
import "./styles/login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";

function Page() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    invalid: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
      invalid: "",
    };

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = "Invalid email address.";
    }
    if (password.length < 6) {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch({
          type: "LOGIN",
          payload: {
            ...user,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
          },
        });
      }

      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        invalid: "Invalid credentials. Please try again.",
      }));
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="loginForm">
        <input
          type="email"
          placeholder="email"
          value={email}
          maxLength={25}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit">Login</button>
        {errors.invalid && <span className="error">{errors.invalid}</span>}
      </form>
      <p>
        don't have an account
        <Link href={"/signup"}>
          <span> Sign Up</span>
        </Link>
      </p>
    </div>
  );
}

export default Page;
