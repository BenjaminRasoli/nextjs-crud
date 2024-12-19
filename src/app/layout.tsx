import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
