import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Log_in from "./pages/Log_in";
import RecoverPass from "./pages/RecoverPass";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log_in" element={<Log_in />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
      </Routes>
    </div>
  )
}

export default App;