import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const estadoColores = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_CAMINO: "bg-blue-100 text-blue-800",
  ENTREGADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800"
};

const EntregasCliente = () => {
  const [ordenesConEntrega, setOrdenesConEntrega] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8090";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener datos del usuario
      const usuarioRes = await axios.get(`${API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const cedula = usuarioRes.data?.cedula;
      if (!cedula) throw new Error("No se pudo obtener la cédula del usuario");

      // 2. Obtener órdenes del cliente
      const ordenesRes = await axios.get(`${API_BASE}/api/ordenes/cliente/${cedula}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // 3. Obtener todas las entregas
      const entregasRes = await axios.get(`${API_BASE}/entregas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // 4. Filtrar y combinar datos
      const ordenesFiltradas = ordenesRes.data
        .map(orden => {
          // Buscar entregas asociadas a esta orden
          const entregasAsociadas = entregasRes.data.filter(
            entrega => entrega.ordenId === orden.id
          );

          return {
            ...orden,
            entregas: entregasAsociadas.map(entrega => ({
              ...entrega,
              fecha_formateada: entrega.fechaEstimada 
                ? format(new Date(entrega.fechaEstimada), "PPP", { locale: es })
                : "Sin fecha definida"
            }))
          };
        })
        .filter(orden => orden.entregas.length > 0); // Solo órdenes con entregas

      setOrdenesConEntrega(ordenesFiltradas);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus entregas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={cargarDatos}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Mis Entregas</h1>

      {ordenesConEntrega.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No tienes entregas pendientes</h3>
          <p className="text-gray-500">Tus entregas aparecerán aquí cuando estén en proceso</p>
        </div>
      ) : (
        <div className="space-y-8">
          {ordenesConEntrega.map(orden => (
            <div key={orden.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Orden #{orden.id} - {orden.estado}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs ${estadoColores[orden.estado] || "bg-gray-200"}`}>
                    {orden.estado}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Dirección: {orden.direccion_envio || "No especificada"}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {orden.entregas.map(entrega => (
                  <div key={entrega.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estado entrega</p>
                        <p className={`text-sm ${estadoColores[entrega.estado]}`}>
                          {entrega.estado}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha estimada</p>
                        <p className="text-sm text-gray-900">{entrega.fecha_formateada}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Repartidor</p>
                        <p className="text-sm text-gray-900">
                          {entrega.nombreRepartidor || "Por asignar"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntregasCliente;