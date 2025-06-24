import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth() || {};

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      e.preventDefault();
      navigate(`/buscar?nombre=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
    setCategoriesOpen(false);
    setUserMenuOpen(false);
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setCategoriesOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const renderNavbar = () => {
    if (!user) {
      return renderGuestNavbar();
    }
    
    const userRole = user.role?.toLowerCase().trim();
    let normalizedRole = 'guest';
    
    if (userRole.includes('admin') || userRole.includes('administrador')) {
      normalizedRole = 'admin';
    } else if (userRole.includes('client') || userRole.includes('cliente')) {
      normalizedRole = 'client';
    } else if (userRole.includes('delivery') || userRole.includes('repartidor')) {
      normalizedRole = 'delivery';
    }

    switch(normalizedRole) {
      case 'admin': return renderAdminNavbar();
      case 'client': return renderClientNavbar();
      case 'delivery': return renderDeliveryNavbar();
      default: return renderGuestNavbar();
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

  const renderCategoriesDropdown = () => (
    <div className="relative" ref={categoriesRef}>
      <button 
        onClick={toggleCategories}
        className="flex items-center gap-1 hover:text-sky-300"
      >
        Categorías
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
      
      <div className={`absolute ${categoriesOpen ? 'block' : 'hidden'} bg-slate-900 text-white rounded-md mt-1 z-50 min-w-[160px] shadow-lg`}>
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

  const renderUserDropdown = () => (
    <div className="relative" ref={userMenuRef}>
      <button 
        onClick={toggleUserMenu}
        className="flex items-center gap-1 hover:text-sky-300"
      >
        {user?.name || 'Usuario'}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      <div className={`absolute right-0 ${userMenuOpen ? 'block' : 'hidden'} mt-2 w-48 bg-slate-900 text-white rounded-md shadow-lg z-50`}>
        {user?.role === 'admin' ? (
          <Link to="/perfil-admin" className="block px-4 py-2 hover:bg-sky-800" onClick={() => setUserMenuOpen(false)}>
            Mi Perfil
          </Link>
        ) : user?.role === 'delivery' ? (
          <Link to="/perfil-repartidor" className="block px-4 py-2 hover:bg-sky-800" onClick={() => setUserMenuOpen(false)}>
            Perfil
          </Link>
        ) : (
          <Link to="/perfil" className="block px-4 py-2 hover:bg-sky-800" onClick={() => setUserMenuOpen(false)}>
            Mi perfil
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 hover:bg-sky-800"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  const renderClientNavbar = () => (
    <ul className="flex gap-6 text-sm items-center">
      <Link to="/" className="hover:text-sky-300">Inicio</Link>
      <Link to="/nosotros" className="hover:text-sky-300">Nosotros</Link>
      {renderCategoriesDropdown()}
      {renderUserDropdown()}
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
      {renderUserDropdown()}
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
      {renderUserDropdown()}
      <Link to="/carrito" className="hover:text-sky-300">
        <ShoppingCart size={20} />
      </Link>
    </ul>
  );

  return (
    <nav className="bg-blue-950 text-white px-4 py-6 sm:px-[7vw] lg:px-[10vw] w-full">
      <div className="flex justify-between items-center h-20">
        <Link to="/" onClick={() => { setMenuOpen(false); setCategoriesOpen(false); setUserMenuOpen(false); }}>
          <img src={logo} alt="Logo" className="h-16 sm:h-20" />
        </Link>

        <div className="hidden sm:flex flex-1 justify-between items-center ml-6">
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

          {renderNavbar()}
        </div>

        <div className="flex sm:hidden items-center gap-4">
          {user && (
            <Link to="/carrito">
              <ShoppingCart size={28} />
            </Link>
          )}
          <button onClick={toggleMobileMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="sm:hidden mt-2 px-4 py-3 bg-blue-900 rounded-md space-y-3">
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

          {!user ? (
            <>
              <Link to="/" onClick={toggleMobileMenu} className="block">Inicio</Link>
              <Link to="/log_in" onClick={toggleMobileMenu} className="block">Iniciar sesión</Link>
              <Link to="/registro" onClick={toggleMobileMenu} className="block">Registrarse</Link>
              <Link to="/nosotros" onClick={toggleMobileMenu} className="block">Nosotros</Link>
              <button 
                onClick={toggleCategories}
                className="flex items-center justify-between w-full py-2"
              >
                <span>Categorías</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
              {categoriesOpen && (
                <div className="ml-4 space-y-2">
                  <Link to="/productos" onClick={toggleMobileMenu} className="block">Electrónica</Link>
                  <Link to="/productos/Moda" onClick={toggleMobileMenu} className="block">Moda</Link>
                  <Link to="/productos/hogar" onClick={toggleMobileMenu} className="block">Hogar</Link>
                  <Link to="/productos/tecnologia" onClick={toggleMobileMenu} className="block">Tecnología</Link>
                  <Link to="/productos/belleza" onClick={toggleMobileMenu} className="block">Belleza</Link>
                  <Link to="/productos/hogar" onClick={toggleMobileMenu} className="block">Mascotas</Link>
                  <Link to="/productos/bebes" onClick={toggleMobileMenu} className="block">Bebés</Link>
                  <Link to="/productos/herramientas" onClick={toggleMobileMenu} className="block">Herramientas</Link>
                  <Link to="/productos/construccion" onClick={toggleMobileMenu} className="block">Construcción</Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/" onClick={toggleMobileMenu} className="block">Inicio</Link>
              <Link to="/nosotros" onClick={toggleMobileMenu} className="block">Nosotros</Link>
              <button 
                onClick={toggleCategories}
                className="flex items-center justify-between w-full py-2"
              >
                <span>Categorías</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
              {categoriesOpen && (
                <div className="ml-4 space-y-2">
                  <Link to="/productos" onClick={toggleMobileMenu} className="block">Electrónica</Link>
                  <Link to="/productos/Moda" onClick={toggleMobileMenu} className="block">Moda</Link>
                  <Link to="/productos/hogar" onClick={toggleMobileMenu} className="block">Hogar</Link>
                  <Link to="/productos/tecnologia" onClick={toggleMobileMenu} className="block">Tecnología</Link>
                  <Link to="/productos/belleza" onClick={toggleMobileMenu} className="block">Belleza</Link>
                  <Link to="/productos/hogar" onClick={toggleMobileMenu} className="block">Mascotas</Link>
                  <Link to="/productos/bebes" onClick={toggleMobileMenu} className="block">Bebés</Link>
                  <Link to="/productos/herramientas" onClick={toggleMobileMenu} className="block">Herramientas</Link>
                  <Link to="/productos/construccion" onClick={toggleMobileMenu} className="block">Construcción</Link>
                </div>
              )}
              <button 
                onClick={toggleUserMenu}
                className="flex items-center justify-between w-full py-2"
              >
                <span>{user?.name || 'Usuario'}</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
              {userMenuOpen && (
                <div className="ml-4 space-y-2">
                  {user?.role === 'admin' ? (
                    <Link to="/perfil-admin" onClick={toggleMobileMenu} className="block">Mi Perfil</Link>
                  ) : user?.role === 'delivery' ? (
                    <Link to="/perfil-repartidor" onClick={toggleMobileMenu} className="block">Perfil</Link>
                  ) : (
                    <Link to="/perfil" onClick={toggleMobileMenu} className="block">Mi perfil</Link>
                  )}
                  {user?.role === 'client' && (
                    <Link to="/historial-compras" onClick={toggleMobileMenu} className="block">Historial de compras</Link>
                  )}
                  {user?.role === 'delivery' && (
                    <Link to="/entregas-pendientes" onClick={toggleMobileMenu} className="block">Entregas asignadas</Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin/productos" onClick={toggleMobileMenu} className="block">Edición de productos</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;