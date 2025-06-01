// Perfil_repartidor.jsx
import React from 'react';

const Perfil_repartidor = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 min-h-screen">
        <h2 className="text-lg font-bold mb-4">Mi cuenta</h2>
        <nav className="flex flex-col gap-2">
          <a href="#" className="hover:bg-blue-100 rounded p-2">Entregas asignadas</a>
          <a href="#" className="hover:bg-blue-100 rounded p-2">Historial de entregas</a>
          <a href="#" className="hover:bg-blue-100 rounded p-2">Configuración</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
            LR
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Laura Tatiana Coicue Poquiguegue</h1>
            <p className="text-gray-600">Repartidor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Datos personales</h3>
            <p><strong>Email:</strong> laura@gmail.com</p>
            <p><strong>Teléfono:</strong> +57 320 123 4567</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Entregas asignadas</h3>
            <ul className="list-disc list-inside">
              <li>Pedido #12345</li>
              <li>Pedido #54321</li>
              <li>Pedido #67890</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Historial de entregas</h3>
            <ul className="list-disc list-inside">
              <li>Pedido #11111 - Entregado</li>
              <li>Pedido #22222 - Entregado</li>
              <li>Pedido #33333 - Entregado</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil_repartidor;
