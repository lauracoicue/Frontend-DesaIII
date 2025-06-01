import React from 'react';
import { Link } from 'react-router-dom';



const PerfilAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-6">Panel Administrador</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
            <span>👤</span>
            <span>Administrador</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>➕</span>
            <Link to="/crear-usuario" className="">Crear Usuario</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>🛍️</span>
            <Link to="/editor-productos" className="">Editar Productos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📦</span>
            <Link to="/pedidos" className="">Ver Pedidos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📝</span>
            <Link to="/asignar-pedidos" className="">Asignar Pedidos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Configuración</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Usuario */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-semibold">
              AD
            </div>
            <div>
              <h1 className="text-xl font-semibold">Administrador Principal</h1>
              <p className="text-gray-600">admin@empresa.com</p>
              <span className="inline-block mt-1 text-sm bg-gray-200 px-2 py-1 rounded">Gestión total de la plataforma</span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Crear Usuario" subtitle="Agrega nuevos usuarios al sistema." />
            <Card title="Editar Productos" subtitle="Gestiona los productos disponibles." />
            <Card title="Ver Pedidos" subtitle="Revisa el estado de los pedidos." />
            <Card title="Asignar Pedidos" subtitle="Asigna pedidos a los repartidores." />
            <Card title="Configuración General" subtitle="Ajusta la configuración del sistema." />
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, subtitle }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  </div>
);

export default PerfilAdmin;
