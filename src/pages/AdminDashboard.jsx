import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administrador</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <p className="text-gray-600 mb-4">Administra usuarios y repartidores.</p>
        
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md mb-4">
          Actualizar Datos
        </button>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
          Crear Repartidores
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
