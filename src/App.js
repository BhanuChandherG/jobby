

import React from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Login from "./Login/index.js";
import Home from "./Home";
import AllJobs from "./AllJobs"
import AboutJobItem from "./AboutJobItem"


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<AllJobs />} />
      <Route path="/jobs/:id" element={<AboutJobItem />} />
    </Routes>
  </BrowserRouter>
);

export default App;

