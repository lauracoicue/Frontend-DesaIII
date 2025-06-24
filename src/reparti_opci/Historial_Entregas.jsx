import React, { useEffect, useState } from "react";
import axios from "axios";

const Historial_Entregas = () => {
  const [entregasEntregadas, setEntregasEntregadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntregasEntregadas = async () => {
      try {
        // Obtener cédula del repartidor logueado (ajusta según tu auth)
        const userResponse = await axios.get('http://localhost:8090/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const cedulaRepartidor = userResponse.data.cedula;
        
        // Obtener todas las entregas del repartidor
        const response = await axios.get(
          `http://localhost:8090/entregas/repartidor/cedula/${cedulaRepartidor}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        // Filtrar solo las entregas en estado "ENTREGADA"
        const entregasFiltradas = response.data.filter(
          entrega => entrega.estado === "ENTREGADA"
        );
        
        setEntregasEntregadas(entregasFiltradas);
      } catch (err) {
        console.error("Error al obtener historial:", err);
        setError("Error al cargar el historial de entregas");
      } finally {
        setLoading(false);
      }
    };

    fetchEntregasEntregadas();
  }, []);

  if (loading) {
    return (
      <div className="max-h-screen bg-blue-50 p-12 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-9">Historial de Entregas</h2>
        <p>Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-screen bg-blue-50 p-12 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-9">Historial de Entregas</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-blue-50 p-12 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-9">Historial de Entregas Entregadas</h2>
      
      {entregasEntregadas.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">Aún no cuentas con entregas finalizadas en tu historial.</p>
          <p>Las entregas completadas aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {entregasEntregadas.map((entrega) => (
            <li
              key={entrega.id}
              className="border shadow-md rounded-xl p-6 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <p><strong>Orden #:</strong> {entrega.ordenId}</p>
                <p><strong>Dirección:</strong> {entrega.direccion}</p>
                <p><strong>Fecha estimada:</strong> {entrega.fechaEstimada}</p>
                <p><strong>Fecha de entrega:</strong> {entrega.fechaEntrega || "No registrada"}</p>
                
                <div className="flex items-center mt-2">
                  <strong>Estado:</strong>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {entrega.estado}
                  </span>
                </div>
                
                {entrega.comentarios && (
                  <p className="mt-3 p-2 bg-gray-50 rounded">
                    <strong>Comentarios:</strong> {entrega.comentarios}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial_Entregas;