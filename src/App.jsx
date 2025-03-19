import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Log_in from "./pages/Log_in";
import RecoverPass from "./pages/RecoverPass";
import Navbar from "./components/Navbar";
import Registro from "./pages/Registro";

const App = () => {
  return (
    <div className="">
      <Navbar/>
      <div className="pt-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log_in" element={<Log_in />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
      </div>
      
    </div>
  )
}

export default App;