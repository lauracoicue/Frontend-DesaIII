import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedidos = () => {
  // Estados definidos según tu API
  const statusCategories = {
    PENDIENTE: { orders: [], loading: true, error: null, label: 'Pendientes' },
    ALISTAMIENTO: { orders: [], loading: true, error: null, label: 'En Alistamiento' },
    LISTA: { orders: [], loading: true, error: null, label: 'Listas para Entrega' }
  };

  const [ordersByStatus, setOrdersByStatus] = useState(statusCategories);
  const [updating, setUpdating] = useState(null);
  const [creatingDelivery, setCreatingDelivery] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    ordenId: null,
    direccion: '',
    fechaEstimada: ''
  });

  // Configuración de axios base
  const createApi = (baseURL) => axios.create({
    baseURL: `http://localhost:8090${baseURL}`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // APIs separadas para órdenes y entregas
  const ordenesApi = createApi('/api/ordenes');
  const entregasApi = createApi('/entregas');

  // Obtener órdenes por estado
  const fetchOrdersByStatus = async (status) => {
    try {
      setOrdersByStatus(prev => ({
        ...prev,
        [status]: { ...prev[status], loading: true, error: null }
      }));
      
      const response = await ordenesApi.get(`/estado/${status}`);
      
      setOrdersByStatus(prev => ({
        ...prev,
        [status]: { 
          ...prev[status], 
          orders: response.data, 
          loading: false 
        }
      }));
    } catch (err) {
      setOrdersByStatus(prev => ({
        ...prev,
        [status]: { 
          ...prev[status], 
          loading: false, 
          error: err.response?.data?.message || 'Error al cargar' 
        }
      }));
      console.error(`Error loading ${status} orders:`, err);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    Object.keys(statusCategories).forEach(status => {
      fetchOrdersByStatus(status);
    });
  }, []);

  // Actualizar estado de una orden
  const updateOrderStatus = async (id, newStatus) => {
    try {
      setUpdating(id);
      await ordenesApi.put(`/${id}/estado`, { estado: newStatus });
      
      // Actualizar ambos estados (el anterior y el nuevo)
      const currentStatus = Object.keys(ordersByStatus).find(status => 
        ordersByStatus[status].orders.some(order => order.id === id)
      );
      
      if (currentStatus) fetchOrdersByStatus(currentStatus);
      fetchOrdersByStatus(newStatus);
      
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  // Crear una nueva entrega
  const createDelivery = async () => {
    try {
      setCreatingDelivery(true);
      const response = await entregasApi.post('', {
        ordenId: deliveryForm.ordenId,
        direccion: deliveryForm.direccion,
        fechaEstimada: deliveryForm.fechaEstimada
      });
      
      alert('Entrega creada exitosamente!');
      // Cerrar el formulario y resetear valores
      setDeliveryForm({
        ordenId: null,
        direccion: '',
        fechaEstimada: ''
      });
      // Actualizar la lista de órdenes
      fetchOrdersByStatus('LISTA');
    } catch (err) {
      console.error('Error creating delivery:', err);
      alert(err.response?.data?.message || 'Error al crear la entrega');
    } finally {
      setCreatingDelivery(false);
    }
  };

  // Abrir el formulario para crear entrega
  const openDeliveryForm = (orderId) => {
    setDeliveryForm({
      ...deliveryForm,
      ordenId: orderId,
      fechaEstimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Fecha actual + 3 días
    });
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Pedidos</h1>
      
      {/* Modal para crear entrega */}
      {deliveryForm.ordenId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Crear Entrega para Orden #{deliveryForm.ordenId}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega:</label>
                <input
                  type="text"
                  value={deliveryForm.direccion}
                  onChange={(e) => setDeliveryForm({...deliveryForm, direccion: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese la dirección"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada:</label>
                <input
                  type="date"
                  value={deliveryForm.fechaEstimada}
                  onChange={(e) => setDeliveryForm({...deliveryForm, fechaEstimada: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setDeliveryForm({...deliveryForm, ordenId: null})}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={createDelivery}
                disabled={creatingDelivery || !deliveryForm.direccion || !deliveryForm.fechaEstimada}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300"
              >
                {creatingDelivery ? 'Creando...' : 'Crear Entrega'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {Object.entries(ordersByStatus).map(([statusKey, statusData]) => (
          <div key={statusKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center justify-between">
                <span>{statusData.label}</span>
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {statusData.orders.length}
                </span>
              </h2>
            </div>

            <div className="p-4">
              {statusData.loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-sm text-gray-600">Cargando órdenes...</p>
                </div>
              ) : statusData.error ? (
                <div className="text-center py-4 text-red-500 text-sm">
                  {statusData.error}
                  <button 
                    className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
                    onClick={() => fetchOrdersByStatus(statusKey)}
                  >
                    Reintentar
                  </button>
                </div>
              ) : statusData.orders.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No hay órdenes en este estado
                </div>
              ) : (
                <div className="space-y-4">
                  {statusData.orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:shadow transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">Orden #{order.id}</h3>
                          <p className="text-xs text-gray-600">Cliente: {order.cedulaCliente}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                          ${order.total.toLocaleString('es-ES')}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Productos:</p>
                        <ul className="space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-xs">
                              <span>
                                {item.nombreProducto} x{item.cantidad}
                              </span>
                              <span className="text-gray-600">
                                ${item.precioUnitario.toLocaleString('es-ES')} c/u
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Creación: {formatDate(order.fechaCreacion)}</p>
                        {order.fechaActualizacion && (
                          <p>Actualizado: {formatDate(order.fechaActualizacion)}</p>
                        )}
                        {order.metodoPago && (
                          <p>Pago: {order.metodoPago}</p>
                        )}
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Cambiar estado:</label>
                        <select
                          value={order.estado}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Object.keys(statusCategories).map(key => (
                            <option key={key} value={key}>
                              {statusCategories[key].label}
                            </option>
                          ))}
                        </select>
                        {updating === order.id && (
                          <p className="text-xs text-gray-500 mt-1">Actualizando...</p>
                        )}
                      </div>

                      {/* Botón para crear entrega (solo en estado LISTA) */}
                      {statusKey === 'LISTA' && (
                        <button
                          onClick={() => openDeliveryForm(order.id)}
                          className="mt-2 w-full bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 transition-colors"
                        >
                          Crear Entrega
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;