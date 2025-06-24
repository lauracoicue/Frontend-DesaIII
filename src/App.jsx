import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Log_in from "./pages/Log_in";
import RecoverPass from "./pages/RecoverPass";
import Navbar from "./components/Navbar";
import Registro from "./pages/Registro";
import Footer from "./components/Footer";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/Detalles";
import ShoppingCart from "./pages/ShoppingCart";
import InventoryManagement from "./pages/InventoryManagement";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Nosotros from "./pages/Nosotros";
import Hist_Ventas from "./cliente-opci/Hist_Ventas"
import Perfil_cliente from "./cliente-opci/Perfil_cliente";
import Editor_produc from "./admin-opci/Editor_produc"
import Pedidos from "./admin-opci/Pedidos";
import PerfilAdmin from "./admin-opci/PerfilAdmin";
import AsignarPedi from "./admin-opci/AsignarPedi";
import CrearUsuario from "./admin-opci/CrearUsuario";
import GestionEntregas from "./admin-opci/GestionEntregas";
import Perfil_repartidor from "./reparti_opci/Perfil_repartidor";
import Historial_Entregas from "./reparti_opci/Historial_Entregas";
import EntregasAsignadas from "./reparti_opci/EntregasAsigna";
import AsignarRepartidores from "./admin-opci/AsignarRepartidores";
import EditarPerfil from "./pages/EditarPerfil";
import MisOrdenes from "./cliente-opci/MisOrdenes";
import Entregas from "./cliente-opci/Entregas";
import { HistorialProvider } from "./context/HistorialContext"; // 👈 Agrega esto



const App = () => {
  return (
    <HistorialProvider> {/* 👈 Envuelve aquí */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow"> {/* Asegura espacio para el navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Productos />} />

            {/* Public Routes */}
            <Route path="/log_in" element={
              <PublicRoute>
                <Log_in />
              </PublicRoute>
            } />
            <Route path="/registro" element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            } />
            <Route path="/recoverpass" element={
              <PublicRoute>
                <RecoverPass />
              </PublicRoute>
            } />
            {/*Public Routes */}
            <Route path="/productos" element={
              <PublicRoute>
                <Productos />
              </PublicRoute>
            } />
            <Route path="/editar-perfil" element={<EditarPerfil />} />
            <Route path="/detalle/:id" element={
              <ProtectedRoute>
                <DetalleProducto />
              </ProtectedRoute>
            } />
            <Route path="/carrito" element={
              <ProtectedRoute>
                <ShoppingCart />
              </ProtectedRoute>
            } />
            {/* Protected Routes */}
            {/* Protected historial */}
            <Route path="/historial-compras" element={
              <ProtectedRoute>
                <Hist_Ventas />
              </ProtectedRoute>
            } />
            <Route path="/mis-ordenes" element={
              <ProtectedRoute>
                <MisOrdenes />
              </ProtectedRoute>
            } />
            <Route path="/pendientes-entregar" element={
              <ProtectedRoute>
                <Entregas />
              </ProtectedRoute>
            } />
            {/* Protected perfil cliente */}
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Perfil_cliente />
              </ProtectedRoute>
            } />
            {/* Protected perfil repartidor */}
            <Route path="/perfil-repartidor" element={
              <ProtectedRoute>
                <Perfil_repartidor />
              </ProtectedRoute>
            } />
            {/* Admin Routes */}
            <Route path="/admin/inventario" element={
              <ProtectedRoute requiredRole="admin">
                <InventoryManagement />
              </ProtectedRoute>
            } />
            {/* Admin Routes */}
            <Route path="/asignar-pedidos" element={
              <ProtectedRoute requiredRole="admin">
                <AsignarPedi />
              </ProtectedRoute>
            } />
            <Route path="/gestion-entregas" element={
              <ProtectedRoute requiredRole="admin">
                <GestionEntregas />
              </ProtectedRoute>
            } />
            {/* Protected Pedidos */}
            <Route path="/pedidos" element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            } />
            {/* Protected Pedidos */}
            <Route path="/crear-usuario" element={
              <ProtectedRoute>
                <CrearUsuario />
              </ProtectedRoute>
            } />
            {/* Protected Pedidos */}
            <Route path="/perfil-admin" element={
              <ProtectedRoute>
                <PerfilAdmin />
              </ProtectedRoute>
            } />
            {/* Protected edicion de productos */}
            <Route path="/editor-productos" element={
              <ProtectedRoute>
                <Editor_produc />
              </ProtectedRoute>
            } />
            {/* Protected edicion de productos */}
            <Route path="/historial-entregas" element={
              <ProtectedRoute>
                <Historial_Entregas />
              </ProtectedRoute>
            } />
            <Route path="/gestion-repartidores" element={<AsignarRepartidores />} />
            {/* Protected edicion de productos */}
            <Route path="/entregas-asignadas" element={
              <ProtectedRoute>
                <EntregasAsignadas />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </HistorialProvider>
  );
};

export default App;