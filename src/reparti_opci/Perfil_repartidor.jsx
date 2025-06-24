import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Perfil_repartidor = () => {
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
            <Link to="/entregas-asignadas" className="">Entregas asignadas</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📜</span>
            <Link to="/historial-entregas" className="">Historial de entregas</Link>
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
              <span className="inline-block mt-1 text-sm bg-yellow-100 px-2 py-1 rounded">Repartidor en servicio</span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              title="Datos personales" 
              subtitle={`Nombre: ${userData?.nombre} ${userData?.apellido}`} 
            />
            <Card 
              title="Información de contacto" 
              subtitle={`Teléfono: ${userData?.telefono || 'No registrado'}\nCorreo: ${userData?.correo}`} 
            />
            <Card 
              title="Entregas asignadas" 
              subtitle="Lista de entregas que debes realizar" 
              warning
            />
            <Card 
              title="Ubicación" 
              subtitle={`${userData?.direccion || 'Dirección no registrada'}\n${userData?.ciudad || 'Ciudad no especificada'}, ${userData?.pais || 'País no especificado'}`} 
            />
            <Card 
              title="Historial de entregas" 
              subtitle="Pedidos que ya han sido entregados" 
            />
            <Card 
              title="Configuración" 
              subtitle="Preferencias de tu cuenta" 
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
        <p className="text-gray-500 text-sm whitespace-pre-line">{subtitle}</p>
      </div>
      {warning && <span className="text-orange-500 font-bold text-lg">!</span>}
    </div>
  </div>
);

export default Perfil_repartidor;