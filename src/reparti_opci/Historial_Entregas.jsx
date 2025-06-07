import React from "react";
import { useHistorial } from "../context/HistorialContext";

const Historial_Entregas = () => {
  const { historialEntregas } = useHistorial();

  return (
    <div className="max-h-screen bg-blue-50 p-12 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-9">Historial de Entregas</h2>
      {historialEntregas.length === 0 ? (
        <p>No hay entregas registradas aún.</p>
      ) : (
        <ul className="grid gap-12 md:grid-cols-2">
          {historialEntregas.map((entrega) => (
            <li
              key={entrega.id}
              className="border shadow-md rounded-xl p-10 px-24 bg-gray-50"
            >
              <p><strong>Cliente:</strong> {entrega.cliente}</p>
              <p><strong>Dirección:</strong> {entrega.direccion}</p>
              <p><strong>Fecha:</strong> {entrega.fecha}</p>
              <p><strong>Productos:</strong> {entrega.productos.join(", ")}</p>
              <p><strong>Estado Final:</strong> 
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {entrega.estado}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial_Entregas;
