import React from 'react';

const AsignarPedi = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <h1 className="text-3xl font-bold mb-6">Asignar Pedidos</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Aquí puedes asignar los pedidos a los repartidores disponibles.
        </p>

        {/* Tabla de pedidos (simulada) */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border-b">ID Pedido</th>
                <th className="px-4 py-2 border-b">Cliente</th>
                <th className="px-4 py-2 border-b">Dirección</th>
                <th className="px-4 py-2 border-b">Repartidor</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí puedes mapear los pedidos dinámicamente */}
              <tr>
                <td className="px-4 py-2 border-b">001</td>
                <td className="px-4 py-2 border-b">Laura Tatiana</td>
                <td className="px-4 py-2 border-b">Calle 123, Ciudad</td>
                <td className="px-4 py-2 border-b">
                  <select className="border rounded p-1">
                    <option value="">Seleccionar</option>
                    <option value="repartidor1">Juan Pérez</option>
                    <option value="repartidor2">Ana López</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">
                  <button className="border-blue-950 bg-blue-950 text-white px-3 py-1 rounded hover:bg-blue-900">
                    Asignar
                  </button>
                </td>
              </tr>
              {/* Repite esta fila para más pedidos */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AsignarPedi;
