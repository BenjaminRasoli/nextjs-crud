import { AuthContext } from "@/app/context/AuthContext";
import Link from "next/link";
import React, { useContext } from "react";
import "./styles/Navbar.scss";
import { useRouter } from "next/navigation";

function Navbar() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT", payload: null });
    router.push("/login");
  };
  return (
    <nav>
      <div>
        <Link href={"/"}>Home</Link>
        <Link href={"/login"}>login</Link>
        <Link href={"/signup"}>signup</Link>
        {currentUser && (
          <>
            <Link href={"/user/post"}>post</Link>
            <Link href={"/user/userinfo"}>userinfo</Link>
          </>
        )}
      </div>

      <div>
        {currentUser ? (
          <h1>
            Welcome {currentUser.userName}
            <button onClick={logout}>logout</button>
          </h1>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
