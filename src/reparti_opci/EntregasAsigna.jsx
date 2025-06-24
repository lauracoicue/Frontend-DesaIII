import React, { useState, useEffect } from "react";
import axios from "axios";

const estados = {
  PENDIENTE: { label: "Pendiente", next: "EN_CAMINO" },
  EN_CAMINO: { label: "En camino", next: "ENTREGADA" },
  ENTREGADA: { label: "Entregada", next: null }
};

const EntregasAsignadas = () => {
  const [entregas, setEntregas] = useState({ asignadas: [], disponibles: [] });
  const [loading, setLoading] = useState({ general: true, acciones: false });
  const [error, setError] = useState(null);
  const [cedulaRepartidor, setCedulaRepartidor] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:8090/entregas',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  const cargarDatos = async () => {
    try {
      setLoading(prev => ({ ...prev, general: true }));
      setError(null);

      const userRes = await axios.get('http://localhost:8090/users/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!userRes.data?.cedula) throw new Error("No se encontró la cédula del repartidor");
      setCedulaRepartidor(userRes.data.cedula);

      const [asignadasRes, disponiblesRes] = await Promise.all([
        api.get(`/repartidor/cedula/${userRes.data.cedula}`),
        api.get('/disponibles')
      ]);

      setEntregas({
        asignadas: asignadasRes.data,
        disponibles: disponiblesRes.data
      });
      setUltimaActualizacion(new Date());

    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.response?.data?.message || err.message || "Error desconocido");
    } finally {
      setLoading(prev => ({ ...prev, general: false }));
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarEstado = async (entregaId, estadoActual) => {
    try {
      setLoading(prev => ({ ...prev, acciones: true }));
      const nuevoEstado = estados[estadoActual]?.next;
      if (!nuevoEstado) return;

      await api.patch(`/${entregaId}/estado?estado=${nuevoEstado}`);
      await cargarDatos();

    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError(err.response?.data?.message || "Error al actualizar el estado");
    } finally {
      setLoading(prev => ({ ...prev, acciones: false }));
    }
  };

  const asignarEntrega = async (entregaId) => {
    try {
      setLoading(prev => ({ ...prev, acciones: true }));
      await api.post(`/${entregaId}/escoger-entrega/cedula/${cedulaRepartidor}`);
      await cargarDatos();

    } catch (err) {
      console.error("Error al asignar entrega:", err);
      setError(err.response?.data?.message || "Error al asignar la entrega");
    } finally {
      setLoading(prev => ({ ...prev, acciones: false }));
    }
  };

  const TarjetaEntrega = ({ entrega, esAsignada }) => (
    <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">Orden #{entrega.ordenId}</h3>
          <p className="text-sm text-gray-600">{entrega.direccion}</p>
          <p className="text-xs mt-1">
            <span className={`px-2 py-1 rounded-full ${
              estadoColores[entrega.estado]
            }`}>
              {estados[entrega.estado]?.label || entrega.estado}
            </span>
          </p>
        </div>
        {entrega.nombreRepartidor && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {entrega.nombreRepartidor}
          </span>
        )}
      </div>

      <div className="mt-4">
        {esAsignada ? (
          estados[entrega.estado]?.next && (
            <button
              onClick={() => cambiarEstado(entrega.id, entrega.estado)}
              disabled={loading.acciones}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
            >
              {loading.acciones ? 'Procesando...' : 
                `Marcar como ${estados[estados[entrega.estado].next]?.label}`}
            </button>
          )
        ) : (
          <button
            onClick={() => asignarEntrega(entrega.id)}
            disabled={loading.acciones}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
          >
            {loading.acciones ? 'Asignando...' : 'Tomar esta entrega'}
          </button>
        )}
      </div>
    </div>
  );

  const estadoColores = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    EN_CAMINO: "bg-blue-100 text-blue-800",
    ENTREGADA: "bg-green-100 text-green-800"
  };

  // 🔥 NUEVO: Filtrar las que NO están entregadas
  const entregasAsignadasNoEntregadas = entregas.asignadas.filter(e => e.estado !== "ENTREGADA");
  const entregasDisponiblesNoEntregadas = entregas.disponibles.filter(e => e.estado !== "ENTREGADA");

  if (loading.general) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={cargarDatos}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Gestión de Entregas</h1>
        {ultimaActualizacion && (
          <p className="text-sm text-gray-500">
            Actualizado: {ultimaActualizacion.toLocaleTimeString()}
          </p>
        )}
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Tus Entregas
          <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {entregasAsignadasNoEntregadas.length}
          </span>
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entregasAsignadasNoEntregadas.length > 0 ? (
            entregasAsignadasNoEntregadas.map(entrega => (
              <TarjetaEntrega key={entrega.id} entrega={entrega} esAsignada />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No tienes entregas asignadas
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Entregas Disponibles
          <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {entregasDisponiblesNoEntregadas.length}
          </span>
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entregasDisponiblesNoEntregadas.length > 0 ? (
            entregasDisponiblesNoEntregadas.map(entrega => (
              <TarjetaEntrega key={entrega.id} entrega={entrega} esAsignada={false} />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay entregas disponibles
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EntregasAsignadas;
