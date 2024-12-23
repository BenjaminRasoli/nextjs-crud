"use client";
import { ReactNode } from "react";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "./globals.scss";
import { AuthContextProvider } from "./context/AuthContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <title>NextJs Firebase Crud</title>
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </AuthContextProvider>
  );
}
