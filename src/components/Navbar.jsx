import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    // Obtener el estado de autenticación correctamente
    const { user, logout } = useAuth() || {};

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            e.preventDefault();
            navigate(`/buscar?nombre=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setMenuOpen(false);
        }
    };

    // Renderizar diferentes Navbars según el tipo de usuario
    const renderNavbar = () => {
        if (!user) {
            return renderGuestNavbar();
        }
        
        // Asegurarnos que el rol está en minúsculas
        const userRole = user.role?.toLowerCase();
        
        switch(userRole) {
            case 'admin':
                return renderAdminNavbar();
            case 'client':
                return renderClientNavbar();
            case 'delivery':
                return renderDeliveryNavbar();
            default:
                return renderGuestNavbar();
        }
    };

    const renderGuestNavbar = () => (
        <ul className="flex gap-6 text-sm items-center">
            <Link to="/" className="hover:text-sky-300">Inicio</Link>
            <Link to="/log_in" className="hover:text-sky-300">Iniciar sesión</Link>
            <Link to="/registro" className="hover:text-sky-300">Registrarse</Link>
            <Link to="/nosotros" className="hover:text-sky-300">Nosotros</Link>
            {renderCategoriesDropdown()}
            <Link to="/carrito" className="hover:text-sky-300">
                <ShoppingCart size={20} />
            </Link>
        </ul>
    );

    const renderClientNavbar = () => (
        <ul className="flex gap-6 text-sm items-center">
          <Link to="/" className="hover:text-sky-300">Inicio</Link>
          <Link to="/nosotros" className="hover:text-sky-300">Nosotros</Link>
          {renderCategoriesDropdown()}
      
          <div className="relative group" onMouseLeave={closeMenu}>
            <button onClick={toggleMenu} className="flex items-center gap-1">
              {user?.name || 'Usuario'}
              <svg
                className="w-6 h-7 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
      
            <div className="absolute hidden group-hover:block right-0 mt-2 w-48 bg-slate-900 text-white rounded-md shadow-lg z-10">
              <Link 
                to="/perfil" 
                className="block px-4 py-2 hover:bg-sky-800"
              >
                Mi perfil
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-sky-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
      
          <Link to="/carrito" className="hover:text-sky-300">
            <ShoppingCart size={20} />
          </Link>
        </ul>
      );
      

      const renderDeliveryNavbar = () => (
        <ul className="flex gap-6 text-sm items-center">
          <Link to="/" className="hover:text-sky-300">Inicio</Link>
          <Link to="/nosotros" className="hover:text-sky-300">Nosotros</Link>
          {renderCategoriesDropdown()}
      
          <div className="relative group" onMouseLeave={closeMenu}>
            <button onClick={toggleMenu} className="flex items-center gap-1">
              {user?.name || 'Usuario'}
              <svg
                className="w-6 h-7 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
      
            <div className="absolute hidden group-hover:block group-focus-within:block right-0 mt-2 w-48 bg-slate-900 text-white rounded-md shadow-lg z-10">
              <Link 
                to="/perfil-repartidor" 
                className="block px-4 py-2 hover:bg-sky-800"
              >
                perfil
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-sky-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
      
          <Link to="/carrito" className="hover:text-sky-300">
            <ShoppingCart size={20} />
          </Link>
        </ul>
      );      


      const renderAdminNavbar = () => (
        <ul className="flex gap-6 text-sm items-center">
          <Link to="/" className="hover:text-sky-300">Inicio</Link>
          <Link to="/nosotros" className="hover:text-sky-300">Nosotros</Link>
          {renderCategoriesDropdown()}
      
          <div className="relative group" onMouseLeave={closeMenu}>
            <button onClick={toggleMenu} className="flex items-center gap-1">
              {user?.name || 'Usuario'}
              <svg
                className="w-6 h-7 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
      
            <div className="absolute hidden group-hover:block right-0 mt-2 w-56 bg-slate-900 text-white rounded-md shadow-lg z-10">
              <Link 
                to="/perfil-admin" 
                className="block px-4 py-2 hover:bg-sky-800"
              >
                Mi Perfil
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-sky-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
      
          <Link to="/carrito" className="hover:text-sky-300">
            <ShoppingCart size={20} />
          </Link>
        </ul>
      );


    const renderCategoriesDropdown = () => (
        <div className="relative group">
            <Link to="#" className="flex items-center gap-1">
                Categorías
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </Link>
            <div className="absolute hidden group-hover:block bg-slate-900 text-white rounded-md mt-1 z-10">
                <Link to="/productos" className="block px-6 py-2 hover:bg-sky-800">Electrónica</Link>
                <Link to="/productos/Moda" className="block px-6 py-2 hover:bg-sky-800">Moda</Link>
                <Link to="/productos/hogar" className="block px-6 py-2 hover:bg-sky-800">Hogar</Link>
                <Link to="/productos/tecnologia" className="block px-6 py-2 hover:bg-sky-800">Tecnología</Link>
                <Link to="/productos/belleza" className="block px-6 py-2 hover:bg-sky-800">Belleza</Link>
                <Link to="/productos/hogar" className="block px-6 py-2 hover:bg-sky-800">Mascotas</Link>
                <Link to="/productos/bebes" className="block px-6 py-2 hover:bg-sky-800">Bebés</Link>
                <Link to="/productos/herramientas" className="block px-6 py-2 hover:bg-sky-800">Herramientas</Link>
                <Link to="/productos/construccion" className="block px-6 py-2 hover:bg-sky-800">Construcción</Link>
            </div>
        </div>
    );

    return (
        <nav className="bg-blue-950 text-white px-4 py-6 sm:px-[7vw] lg:px-[10vw] w-full">
            <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-16 sm:h-20" />
                </Link>

                {/* Menú grande */}
                <div className="hidden sm:flex flex-1 justify-between items-center ml-6">
                    {/* Barra de búsqueda */}
                    <div className="relative w-full max-w-xl mr-6">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full pl-10 py-2 rounded-md text-sm shadow-md border border-gray-300 text-black"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
                    </div>

                    {/* Menú de enlaces */}
                    {renderNavbar()}
                </div>

                {/* Botón hamburguesa */}
                <div className="flex sm:hidden items-center gap-4">
                    {user && (
                        <Link to="/carrito">
                            <ShoppingCart size={28} />
                        </Link>
                    )}
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {menuOpen && (
                <div className="sm:hidden mt-2 px-4 py-3 bg-blue-900 rounded-md space-y-3">
                    {/* Búsqueda */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full pl-10 py-2 rounded-md text-sm text-black"
                            autoFocus
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>

                    {/* Enlaces */}
                    {!user ? (
                        <>
                            <Link to="/" onClick={() => setMenuOpen(false)} className="block">Inicio</Link>
                            <Link to="/log_in" onClick={() => setMenuOpen(false)} className="block">Iniciar sesión</Link>
                            <Link to="/registro" onClick={() => setMenuOpen(false)} className="block">Registrarse</Link>
                            <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block">Nosotros</Link>
                            <Link to="/productos" onClick={() => setMenuOpen(false)} className="block">Categorías</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={() => setMenuOpen(false)} className="block">Inicio</Link>
                            <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block">Nosotros</Link>
                            <Link to="/productos" onClick={() => setMenuOpen(false)} className="block">Categorías</Link>
                            {user.role === 'client' && (
                                <>
                                    <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block">Mi perfil</Link>
                                    <Link to="/historial-compras" onClick={() => setMenuOpen(false)} className="block">Historial de compras</Link>
                                    <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block">Nosotros</Link>
                                </>
                            )}
                            {user.role === 'delivery' && (
                                <>
                                    <Link to="/entregas-pendientes" onClick={() => setMenuOpen(false)} className="block">Entregas asignadas</Link>
                                    <Link to="/historial-entregas" onClick={() => setMenuOpen(false)} className="block">Historial de entregas</Link>
                                    <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block">Nosotros</Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin/productos" onClick={() => setMenuOpen(false)} className="block">Edición de productos</Link>
                                    <Link to="/perfil-admin" onClick={() => setMenuOpen(false)} className="block">Mi perfil</Link>
                                    <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block">Nosotros</Link>
                                </>
                            )}
                            <button 
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                    navigate('/');
                                }}
                                className="block w-full text-left"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;