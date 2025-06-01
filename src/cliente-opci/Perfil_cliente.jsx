import React from 'react';
import { Link } from 'react-router-dom';


const Perfil_cliente = () => {
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-6">Mi cuenta</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>🛒</span>
            <span>Compras</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📝</span>
            <Link to="/historial-compras" className="">Historial</Link>
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
              LC
            </div>
            <div>
              <h1 className="text-xl font-semibold">Laura Tatiana Coicue Poquiguegue</h1>
              <p className="text-gray-600">coicuepoqui2003@gmail.com</p>
              <span className="inline-block mt-1 text-sm bg-gray-200 px-2 py-1 rounded">Estás en nivel 1 - Mercado Puntos</span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Tu información" subtitle="Nombre elegido y datos para identificarte." />
            <Card title="Datos de tu cuenta" subtitle="Datos que representan a la cuenta en Mercado Libre y Mercado Pago." warning />
            <Card title="Seguridad" subtitle="Tienes configuraciones pendientes." warning />
            <Card title="Tarjetas" subtitle="Tarjetas guardadas en tu cuenta." />
            <Card title="Direcciones" subtitle="Direcciones guardadas en tu cuenta." />
            <Card title="Privacidad" subtitle="Preferencias y control sobre el uso de tus datos." />
            <Card title="Comunicaciones" subtitle="Elige qué tipo de información quieres recibir." />
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, subtitle, warning }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      {warning && <span className="text-orange-500 font-bold text-lg">!</span>}
    </div>
  </div>
);

export default Perfil_cliente;
