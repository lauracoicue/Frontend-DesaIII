import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    direccion: '',
    ciudad: '',
    pais: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Función para normalizar el rol
  const normalizeRole = (roleInput) => {
    if (!roleInput) return "ROLE_CLIENTE";

    const role = Array.isArray(roleInput) ? roleInput[0] : roleInput;
    const roleStr = role.toString().toUpperCase();

    if (roleStr.includes('ADMIN') || roleStr.includes('ADMINISTRADOR') || roleStr === 'ROLE_ADMINISTRADOR') {
      return "ROLE_ADMINISTRADOR";
    }
    if (roleStr.includes('DELIVERY') || roleStr.includes('REPARTIDOR') || roleStr === 'ROLE_REPARTIDOR') {
      return "ROLE_REPARTIDOR";
    }
    return "ROLE_CLIENTE";
  };

  // Verificar rol al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Token decodificado:', decoded);

        const userRole = normalizeRole(
          decoded.role ||
          (decoded.authorities && decoded.authorities[0]) ||
          decoded.claims?.role
        );

        console.log('Rol normalizado:', userRole);
        setIsAdmin(userRole === 'ROLE_ADMINISTRADOR');
      } catch (error) {
        console.error('Error decodificando token:', error);
        setError('Error al verificar permisos. Intenta recargar la página.');
      }
    } else {
      setError('No se encontró token de autenticación');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validación básica
      if (!formData.nombre || !formData.correo || !formData.contrasena) {
        throw new Error('Nombre, correo y contraseña son obligatorios');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Configuración idéntica a Postman
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Body idéntico a Postman
      const requestBody = {
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        pais: formData.pais,
        telefono: formData.telefono,
        rol: 'REPARTIDOR' // Exactamente como lo envías en Postman
      };

      console.log('Enviando request:', {
        url: 'http://localhost:8090/users/admin/repartidores',
        method: 'POST',
        headers: config.headers,
        data: requestBody
      });

      const response = await axios.post(
        'http://localhost:8090/users/admin/repartidores',
        requestBody,
        config
      );

      if (response.status === 200 || response.status === 201) {
        alert('Repartidor creado exitosamente');
        navigate('/admin/usuarios');
      } else {
        console.error('Respuesta del servidor:', response);
        throw new Error(response.data?.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Crear Nuevo Repartidor</h1>

        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
            Advertencia: Solo usuarios con rol ADMINISTRADOR pueden crear repartidores
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Cédula*</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isAdmin || loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="2"
              disabled={!isAdmin || loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isAdmin || loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico*</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isAdmin || loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Contraseña*</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
              disabled={!isAdmin || loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isAdmin || loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isAdmin || loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isAdmin || loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isAdmin || loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isAdmin}
            className={`w-full bg-blue-950 text-white font-semibold py-3 rounded-lg transition ${loading || !isAdmin ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-900'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : (
              isAdmin ? 'Crear Repartidor' : 'Se requieren permisos de administrador'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;