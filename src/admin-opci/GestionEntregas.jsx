import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import esLocale from 'date-fns/locale/es';

const GestionEntregas = () => {
  // Definición de estados y colores
  const deliveryStatus = {
    PENDIENTE: { label: 'Pendientes', color: 'bg-yellow-100 text-yellow-800' },
    EN_CAMINO: { label: 'En Camino', color: 'bg-blue-100 text-blue-800' },
    ENTREGADA: { label: 'Entregadas', color: 'bg-green-100 text-green-800' },
    CANCELADA: { label: 'Canceladas', color: 'bg-red-100 text-red-800' }
  };

  const [activeTab, setActiveTab] = useState('PENDIENTE');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [repartidores, setRepartidores] = useState([]);

  // Configuración de Axios
  const api = axios.create({
    baseURL: 'http://localhost:8090/entregas',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return format(parseISO(dateString), 'PPP', { locale: esLocale });
  };

  // Obtener entregas por estado
  const fetchDeliveriesByStatus = async (status) => {
    try {
      setLoading(true);
      const response = await api.get(`/estado/${status}`);
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      setError(`Error al cargar las entregas ${deliveryStatus[status].label.toLowerCase()}`);
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener repartidores (simulado)
  const fetchRepartidores = async () => {
    // En producción, reemplazar con llamada real a tu API
    setRepartidores([
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María Gómez' },
      { id: 3, nombre: 'Carlos Rojas' }
    ]);
  };

  // Cambiar estado de entrega
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setUpdating(id);
      await api.patch(`/${id}/estado?estado=${nuevoEstado}`);
      // Recargar las entregas del estado actual
      await fetchDeliveriesByStatus(activeTab);
    } catch (err) {
      console.error('Error updating delivery:', err);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchDeliveriesByStatus(activeTab);
    fetchRepartidores();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded shadow max-w-md mx-auto mt-8">
        <p>{error}</p>
        <button 
          onClick={() => fetchDeliveriesByStatus(activeTab)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Entregas</h1>
      
      {/* Pestañas de estado */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(deliveryStatus).map(([key, status]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                {deliveries.length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay entregas en estado {deliveryStatus[activeTab].label.toLowerCase()}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Estimada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repartidor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{delivery.ordenId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(delivery.fechaEstimada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.repartidorId ? `Repartidor #${delivery.repartidorId}` : 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="space-y-2">
                        <select
                          value={delivery.estado}
                          onChange={(e) => cambiarEstado(delivery.id, e.target.value)}
                          disabled={updating === delivery.id}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {Object.keys(deliveryStatus).map((status) => (
                            <option key={status} value={status}>
                              {deliveryStatus[status].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionEntregas;