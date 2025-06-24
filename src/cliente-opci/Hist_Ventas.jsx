import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBoxOpen, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Hist_Ventas = () => {
  const [comprasEntregadas, setComprasEntregadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8090";

  const cargarComprasEntregadas = async () => {
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

      // 3. Obtener entregas entregadas
      const entregasRes = await axios.get(`${API_BASE}/entregas?estado=ENTREGADA`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // 4. Cruzar datos: ordenes del usuario con entregas entregadas
      const comprasFiltradas = ordenesRes.data
        .map(orden => {
          // Buscar entregas ENTREGADAS para esta orden
          const entrega = entregasRes.data.find(e => e.ordenId === orden.id);
          if (!entrega) return null;

          return {
            ...orden,
            entrega: {
              ...entrega,
              fecha_formateada: format(new Date(entrega.fechaEstimada), "PPP", { locale: es })
            },
            total: orden.items?.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) || 0
          };
        })
        .filter(compra => compra !== null); // Solo compras con entrega entregada

      setComprasEntregadas(comprasFiltradas);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus compras entregadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarComprasEntregadas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={cargarComprasEntregadas}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Compras Entregadas</h1>

      {comprasEntregadas.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaBoxOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No tienes compras entregadas</h3>
          <p className="text-gray-500">Tus compras aparecerán aquí cuando sean entregadas</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid gap-4">
          {comprasEntregadas.map((compra) => (
            <div
              key={compra.id}
              className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-4 md:flex-row md:justify-between md:items-center hover:shadow-lg transition duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-500" />
                  <p className="text-sm text-gray-500">
                    Entregado el: <span className="font-semibold">{compra.entrega.fecha_formateada}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Orden #: <span className="font-semibold">{compra.id}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Dirección: <span className="font-semibold">{compra.direccion_envio || "No especificada"}</span>
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-2">
                  {compra.items?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaBoxOpen className="text-blue-500" /> 
                      {item.nombreProducto || `Producto ${index + 1}`} 
                      <span className="text-sm text-gray-500">(x{item.cantidad})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-lg font-bold text-gray-800">
                  Total: ${compra.total.toLocaleString()}
                </p>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                  ENTREGADA
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hist_Ventas;