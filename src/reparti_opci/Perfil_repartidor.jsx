import React from 'react';
import { Link } from 'react-router-dom';

const Perfil_repartidor = () => {
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-6">Mi cuenta</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>📦</span>
            <Link to="/entregas-asignadas" className="">Entregas asignadas</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📜</span>
            <Link to="/historial-entregas" className="">Historial de entregas</Link>
          </div>
          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
            <span>👤</span>
            <span>Mi perfil</span>
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
            <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-semibold">
              LR
            </div>
            <div>
              <h1 className="text-xl font-semibold">Laura Tatiana Coicue Poquiguegue</h1>
              <p className="text-gray-600">laura@gmail.com</p>
              <span className="inline-block mt-1 text-sm bg-yellow-100 px-2 py-1 rounded">Repartidor en servicio</span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Datos personales" subtitle="Correo, teléfono y otra información de contacto." />
            <Card title="Entregas asignadas" subtitle="Lista de entregas que debes realizar." />
            <Card title="Historial de entregas" subtitle="Pedidos que ya han sido entregados." />
            <Card title="Configuración" subtitle="Preferencias de tu cuenta y notificaciones." />
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

export default Perfil_repartidor;
