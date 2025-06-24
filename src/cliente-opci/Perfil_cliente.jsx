import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Perfil_cliente = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  // Generar iniciales para el avatar
  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-6">Mi cuenta</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
            <span>👤</span>
            <span>Mi perfil</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📊</span>
            <Link to="/editar-perfil" className="text-blue-600 hover:underline">Editar perfil</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📦</span>
            <Link to="/mis-ordenes" className="">Mis Ordenes</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>🛒</span>
            <Link to="/pendientes-entregar" className="">Pendientes por Entrega</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📝</span>
            <Link to="/historial-compras" className="">Historial</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Configuración</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Usuario */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-semibold">
              {getInitials(userData?.nombre, userData?.apellido)}
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                {userData?.nombre} {userData?.apellido}
              </h1>
              <p className="text-gray-600">{userData?.correo}</p>
              <span className="inline-block mt-1 text-sm bg-gray-200 px-2 py-1 rounded">
                Estás en nivel 1 - Mercado Puntos
              </span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Tu información"
              subtitle={`Nombre: ${userData?.nombre} ${userData?.apellido}`}
            />
            <Card
              title="Datos de tu cuenta"
              subtitle={`Correo: ${userData?.correo}`}
              warning
            />
            <Card
              title="Seguridad"
              subtitle="Tienes configuraciones pendientes."
              warning
            />
            <Card
              title="Direcciones"
              subtitle={`${userData?.direccion ? userData.direccion : 'No hay dirección registrada'}`}
            />
            <Card
              title="Contacto"
              subtitle={`Teléfono: ${userData?.telefono || 'No registrado'}`}
            />
            <Card
              title="Ubicación"
              subtitle={`${userData?.ciudad || 'Ciudad no especificada'}, ${userData?.pais || 'País no especificado'}`}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, subtitle, warning }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      {warning && <span className="text-orange-500 font-bold text-lg">!</span>}
    </div>
  </div>
);

export default Perfil_cliente;