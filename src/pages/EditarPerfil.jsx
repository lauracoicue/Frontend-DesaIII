import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarPerfil = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData({
          nombre: response.data.nombre || '',
          apellido: response.data.apellido || '',
          telefono: response.data.telefono || '',
          direccion: response.data.direccion || '',
          ciudad: response.data.ciudad || '',
          pais: response.data.pais || ''
        });
      } catch (err) {
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('http://localhost:8090/users/me', userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => navigate(-1), 1500); // Regresar a la página anterior después de 1.5 segundos
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData.nombre) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">←</span> Volver
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded shadow">
              {error}
              <button 
                onClick={() => setError(null)}
                className="float-right text-red-700 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-green-50 text-green-600 rounded shadow">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos editables */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={userData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={userData.apellido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={userData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={userData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={userData.ciudad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  type="text"
                  name="pais"
                  value={userData.pais}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Campos no editables (solo lectura) */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={userData.correo || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                <input
                  type="text"
                  value={userData.cedula || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarPerfil;