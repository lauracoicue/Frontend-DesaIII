import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Log_in from "./pages/Log_in";
import RecoverPass from "./pages/RecoverPass";
import Navbar from "./components/Navbar";
import Registro from "./pages/Registro";
import Footer from "./components/Footer"
import ClienteDashboard from "./pages/ClienteDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/Detalles";

const App = () => {
  return (
    <div >
      <Navbar/>
      <div className='pt-2'>
      <Routes>
        <Route path="/productos" element={<Productos/>}></Route>
        <Route path="/detalle/:id" element={<DetalleProducto />} />
        <Route path="/" element={<Home />} />
        <Route path="/log_in" element={<Log_in />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App;