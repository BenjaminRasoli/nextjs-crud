"use client";
import { useContext, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "./globals.scss";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const loginPath = usePathname();

  const RequireAuth = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
      if (currentUser === null) {
        router.push("/login");
      }
    }, [currentUser, router]);

    if (!currentUser) {
      return null;
    }
    return <>{children}</>;
  };

  let isLoginOrSignup =
    loginPath === "/login" || loginPath === "/signup" || loginPath === "/";
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Navbar />
          {isLoginOrSignup ? children : <RequireAuth>{children}</RequireAuth>}
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
