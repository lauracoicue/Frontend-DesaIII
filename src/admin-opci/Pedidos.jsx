import React, { useState } from 'react';

const Pedidos = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'Laura Pérez',
      items: [
        { name: 'Camiseta', quantity: 2 },
        { name: 'Zapatos', quantity: 1 },
      ],
      total: 100,
      status: 'Pendiente',
    },
    {
      id: 2,
      customer: 'Carlos López',
      items: [{ name: 'Pantalón', quantity: 1 }],
      total: 40,
      status: 'Enviado',
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="p-8 from-blue-100 to-white min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Pedidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Pedido #{order.id}</h2>
            <p><strong>Cliente:</strong> {order.customer}</p>
            <p className="mt-2 font-semibold">Productos:</p>
            <ul className="list-disc pl-5">
              {order.items.map((item, index) => (
                <li key={index}>{item.name} x{item.quantity}</li>
              ))}
            </ul>
            <p className="mt-2"><strong>Total:</strong> ${order.total}</p>
            <p className="mt-2"><strong>Estado:</strong> <span className="font-bold">{order.status}</span></p>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">Actualizar Estado:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              >
                <option>Pendiente</option>
                <option>En preparación</option>
                <option>Enviado</option>
                <option>Entregado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
