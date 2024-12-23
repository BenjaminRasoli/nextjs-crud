"use client";
import { AuthContext } from "@/app/context/AuthContext";
import { useContext } from "react";
import "./styles/userInfo.scss";
import Link from "next/link";

function Page() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      {currentUser ? (
        <div className="user-info-container">
          <div className="user-info-header">
            <h1>User Information</h1>
          </div>

          <div className="user-info-card">
            <div className="user-info-field">
              <strong>First Name:</strong> {currentUser.firstName}
            </div>
            <div className="user-info-field">
              <strong>Last Name:</strong> {currentUser.lastName}
            </div>
            <div className="user-info-field">
              <strong>User Name:</strong> {currentUser.userName}
            </div>
            <div className="user-info-field">
              <strong>Email:</strong> {currentUser.email}
            </div>
          </div>
        </div>
      ) : (
        <div className="userinfo-text">
          Please
          <Link href="/login" className="link">
            login
          </Link>
          or
          <Link href="/signup" className="link">
            sign up
          </Link>
          first
        </div>
      )}
    </div>
  );
}

export default Page;
