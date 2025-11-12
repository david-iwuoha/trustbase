import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./app/page.jsx";
import SignInPage from "./app/account/signin/page.jsx";
import LogOutPage from "./app/account/logout/page.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Account routes */}
      <Route path="/account/signin" element={<SignInPage />} />
      <Route path="/account/logout" element={<LogOutPage />} />
    </Routes>
  </BrowserRouter>
);
