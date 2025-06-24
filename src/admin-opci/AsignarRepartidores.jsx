import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import esLocale from 'date-fns/locale/es';

const AsignarRepartidores = () => {
  // Estados del componente
  const [entregasPendientes, setEntregasPendientes] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  // Obtener entregas sin repartidor asignado
  const fetchEntregasSinRepartidor = async () => {
    try {
      setLoading(true);
      // Primero obtenemos todas las entregas pendientes
      const response = await api.get('/estado/PENDIENTE');
      // Filtramos solo las que no tienen repartidor asignado
      const entregasSinRepartidor = response.data.filter(entrega => !entrega.repartidorId);
      setEntregasPendientes(entregasSinRepartidor);
      setError(null);
    } catch (err) {
      setError('Error al cargar las entregas pendientes');
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de repartidores disponibles
  const fetchRepartidores = async () => {
    try {
      // En un caso real, aquí harías una llamada a tu API de repartidores
      // Por ahora simulamos datos
      setRepartidores([
        { id: 1, nombre: 'Juan Pérez', disponible: true },
        { id: 2, nombre: 'María Gómez', disponible: true },
        { id: 3, nombre: 'Carlos Rojas', disponible: true }
      ]);
    } catch (err) {
      console.error('Error fetching delivery people:', err);
    }
  };

  // Manejar cambio de selección de repartidor
  const handleRepartidorChange = (entregaId, repartidorId) => {
    setAsignaciones(prev => ({
      ...prev,
      [entregaId]: repartidorId
    }));
  };

  // Asignar repartidores
  const handleAsignar = async () => {
    try {
      setLoading(true);
      
      // Crear un array de promesas para todas las asignaciones
      const asignacionesPromesas = Object.entries(asignaciones)
        .filter(([_, repartidorId]) => repartidorId)
        .map(([entregaId, repartidorId]) => 
          api.post(`/${entregaId}/asignar-repartidor/${repartidorId}`)
        );

      // Ejecutar todas las asignaciones
      await Promise.all(asignacionesPromesas);
      
      setSuccess('Repartidores asignados correctamente');
      setAsignaciones({});
      // Recargar la lista de entregas
      await fetchEntregasSinRepartidor();
    } catch (err) {
      setError('Error al asignar repartidores');
      console.error('Error assigning delivery people:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchEntregasSinRepartidor();
    fetchRepartidores();
  }, []);

  if (loading && entregasPendientes.length === 0) {
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
          onClick={fetchEntregasSinRepartidor}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Asignar Repartidores</h1>
      
      {success && (
        <div className="p-4 mb-6 bg-green-50 text-green-600 rounded shadow">
          {success}
          <button 
            onClick={() => setSuccess(null)}
            className="float-right text-green-700 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {entregasPendientes.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No hay entregas pendientes sin repartidor asignado</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Entrega</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Estimada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignar Repartidor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entregasPendientes.map((entrega) => (
                    <tr key={entrega.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entrega.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{entrega.ordenId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.direccion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entrega.fechaEstimada)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          value={asignaciones[entrega.id] || ''}
                          onChange={(e) => handleRepartidorChange(entrega.id, e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Seleccionar repartidor</option>
                          {repartidores.map((repartidor) => (
                            <option key={repartidor.id} value={repartidor.id}>
                              {repartidor.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAsignar}
              disabled={loading || Object.keys(asignaciones).length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Asignando...' : 'Confirmar Asignaciones'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AsignarRepartidores;