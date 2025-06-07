import React from "react";
import { useHistorial } from "../context/HistorialContext";

const estados = ["Pendiente", "Enviado", "En camino", "Cerca", "Entregado"]; // Agregamos "Pendiente" aquí

const EntregasAsignadas = () => {
  const { entregasAsignadas, avanzarEstadoEntrega } = useHistorial();

  const obtenerSiguienteEstado = (estadoActual) => {
    const idx = estados.indexOf(estadoActual);
    return estados[idx + 1];
  };

  // Objeto para mapear estados a clases de Tailwind CSS
  const estadoColores = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    Enviado: "bg-blue-100 text-blue-800",
    "En camino": "bg-purple-100 text-purple-800",
    Cerca: "bg-green-100 text-green-800",
    Entregado: "bg-gray-100 text-gray-800", // Aunque se moverá, es bueno tenerlo
  };

  return (
    <div className="max-h-screen bg-blue-50 p-12 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Entregas Asignadas</h2>
      {entregasAsignadas.length === 0 ? (
        <p>No hay entregas asignadas.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {entregasAsignadas.map((entrega) => {
            const siguienteEstado = obtenerSiguienteEstado(entrega.estado);
            const colorClase = estadoColores[entrega.estado] || "bg-gray-200 text-gray-900"; // Fallback por si acaso

            return (
              <li
                key={entrega.id}
                className="border shadow-md rounded-xl p-10 px-24 flex flex-col gap-2 bg-white"
              >
                <p><strong>Cliente:</strong> {entrega.cliente}</p>
                <p><strong>Dirección:</strong> {entrega.direccion}</p>
                <p><strong>Fecha:</strong> {entrega.fecha}</p>
                <p><strong>Productos:</strong> {entrega.productos.join(", ")}</p>
                <p>
                  <strong>Estado:</strong>
                  <span className={`ml-2 px-2 py-1 rounded-full ${colorClase}`}>
                    {entrega.estado}
                  </span>
                </p>
                <button
                  className={`mt-2 self-start ${
                    siguienteEstado
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white px-4 py-2 rounded`}
                  disabled={!siguienteEstado}
                  onClick={() =>
                    avanzarEstadoEntrega(entrega.id, entrega.estado)
                  }
                >
                  {siguienteEstado
                    ? `Avanzar a: ${siguienteEstado}`
                    : "Entregado"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EntregasAsignadas;