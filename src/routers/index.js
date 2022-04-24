import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
export default Routers;
