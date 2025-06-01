import React from 'react';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const comprasMock = [
  {
    id: 1,
    fecha: '2025-05-20',
    productos: ['Auriculares Inalámbricos', 'Funda para Celular'],
    total: 150000,
    estado: 'Entregado',
  },
  {
    id: 2,
    fecha: '2025-05-15',
    productos: ['Camiseta Deportiva'],
    total: 45000,
    estado: 'Enviado',
  },
  {
    id: 3,
    fecha: '2025-05-10',
    productos: ['Laptop', 'Mouse Inalámbrico'],
    total: 3200000,
    estado: 'Entregado',
  },
];

const badgeColor = (estado) => {
  switch (estado) {
    case 'Entregado':
      return 'bg-green-100 text-green-700';
    case 'Enviado':
      return 'bg-yellow-100 text-yellow-700';
    case 'Cancelado':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Hist_Ventas = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Compras</h1>

      <div className="w-full max-w-4xl grid gap-4">
        {comprasMock.map((compra) => (
          <div
            key={compra.id}
            className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-4 md:flex-row md:justify-between md:items-center hover:shadow-lg transition duration-300"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-500">Fecha de compra: <span className="font-semibold">{compra.fecha}</span></p>
              <ul className="list-disc list-inside text-gray-700 mt-2 ml-2">
                {compra.productos.map((producto, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaBoxOpen className="text-blue-500" /> {producto}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-lg font-bold text-gray-800">
                Total: ${compra.total.toLocaleString()}
              </p>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${badgeColor(compra.estado)}`}
              >
                {compra.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hist_Ventas;
