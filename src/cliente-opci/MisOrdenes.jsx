import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const estadoColores = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  LISTA: "bg-blue-100 text-blue-800",
  ENTREGADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800"
};

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8090";

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener datos del usuario con el token
      const usuarioRes = await axios.get(`${API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const cedula = usuarioRes.data?.cedula;
      if (!cedula) throw new Error("No se pudo obtener la cédula del usuario");

      // Obtener órdenes del cliente (solo no entregadas)
      const ordenesRes = await axios.get(`${API_BASE}/api/ordenes/cliente/${cedula}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Filtrar y formatear datos
      const ordenesActivas = ordenesRes.data
        .filter(orden => orden.estado !== "ENTREGADA")
        .map(orden => ({
          ...orden,
          fecha_actualizacion: orden.fecha_actualizacion 
            ? format(new Date(orden.fecha_actualizacion), "PPPpp", { locale: es })
            : "Sin fecha registrada"
        }));

      setOrdenes(ordenesActivas);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
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
          onClick={cargarOrdenes}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Mis Órdenes Activas</h1>

      {ordenes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No tienes órdenes activas</h3>
          <p className="text-gray-500">Tus órdenes aparecerán aquí cuando las realices</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Orden #
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dirección de Envío
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Última Actualización
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Productos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ordenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      #{orden.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${estadoColores[orden.estado] || "bg-gray-200"}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {orden.direccion_envio || "No especificada"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {orden.fecha_actualizacion}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {orden.items?.slice(0, 2).map((prod, index) => (
                          <li key={index}>
                            {prod.nombreProducto} (x{prod.cantidad})
                          </li>
                        ))}
                        {orden.items?.length > 2 && (
                          <li className="text-gray-400">+{orden.items.length - 2} más</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-gray-500 text-right">
            Mostrando {ordenes.length} {ordenes.length === 1 ? "orden activa" : "órdenes activas"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MisOrdenes;