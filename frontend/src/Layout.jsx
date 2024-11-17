import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/dashboard";

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;
