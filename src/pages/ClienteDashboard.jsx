import React from "react";

const ClienteDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel del Cliente</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <p className="text-gray-600 mb-4">Bienvenido, aquí puedes administrar tu perfil.</p>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mb-4">
          Actualizar Perfil
        </button>
        
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md">
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};

export default ClienteDashboard;
