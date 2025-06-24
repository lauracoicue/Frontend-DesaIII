import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PerfilAdmin = () => {
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-6">Panel Administrador</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
            <span>👤</span>
            <span>Administrador</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>➕</span>
            <Link to="/crear-usuario" className="">Crear Usuario</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>🛍️</span>
            <Link to="/editor-productos" className="">Editar Productos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📦</span>
            <Link to="/pedidos" className="">Ver Pedidos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>🚚</span>
            <Link to="/gestion-entregas" className="">Gestión de Entregas</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>👷</span>
            <Link to="/gestion-repartidores" className="">Gestión Repartidores</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📝</span>
            <Link to="/asignar-pedidos" className="">Asignar Pedidos</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>📊</span>
           <Link to="/editar-perfil" className="text-blue-600 hover:underline">Editar perfil</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚙️</span>
            <Link to="/configuracion" className="">Configuración</Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Usuario */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-semibold">
              {getInitials(userData?.nombre, userData?.apellido)}
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                {userData?.nombre} {userData?.apellido}
              </h1>
              <p className="text-gray-600">{userData?.correo}</p>
              <span className="inline-block mt-1 text-sm bg-gray-200 px-2 py-1 rounded">
                {userData?.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>

          {/* Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              title="Crear Usuario" 
              subtitle="Agrega nuevos usuarios al sistema." 
              icon="👥"
              link="/crear-usuario"
            />
            <Card 
              title="Editar Productos" 
              subtitle="Gestiona los productos disponibles." 
              icon="🛍️"
              link="/editor-productos"
            />
            <Card 
              title="Ver Pedidos" 
              subtitle="Revisa el estado de los pedidos." 
              icon="📦"
              link="/pedidos"
            />
            <Card 
              title="Gestión de Entregas" 
              subtitle="Administra el estado de las entregas." 
              icon="🚚"
              link="/gestion-entregas"
            />
            <Card 
              title="Gestión Repartidores" 
              subtitle="Administra los repartidores." 
              icon="👷"
              link="/gestion-repartidores"
            />
            <Card 
              title="Asignar Pedidos" 
              subtitle="Asigna pedidos a repartidores." 
              icon="📝"
              link="/asignar-pedidos"
            />
            <Card 
              title="Reportes" 
              subtitle="Genera reportes del sistema." 
              icon="📊"
              link="/reportes"
            />
            <Card 
              title="Configuración" 
              subtitle="Ajusta la configuración del sistema." 
              icon="⚙️"
              link="/configuracion"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, subtitle, icon, link }) => (
  <Link to={link} className="block">
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition h-full">
      <div className="flex items-start space-x-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default PerfilAdmin;