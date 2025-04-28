import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            e.preventDefault();
            navigate(`/buscar?nombre=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setShowMobileSearch(false); // cerrar barra en móvil al buscar
        }
    };

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw] w-full lg:flex h-36 bg-blue-950 flex justify-between items-center">
            {/* Logo */}
            <Link to="/">
                <img src={logo} alt="Logo" className="size-32 mx-32 cursor-pointer" />
            </Link>

            {/* Barra de búsqueda */}
            <div className="flex-1 flex justify-center">
                {/* Pantallas grandes: barra completa */}
                <div className="relative hidden sm:block w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full pl-10 py-2 -mx-12 rounded-md text-sm shadow-md border border-gray-300"
                    />
                    <Search className="absolute right-20 top-2.5 text-gray-500" size={20} />
                </div>

                {/* Pantallas pequeñas: icono y barra pequeña al hacer clic */}
                <div className="sm:hidden relative">
                    {!showMobileSearch ? (
                        <button
                            onClick={() => setShowMobileSearch(true)}
                            className="p-2 text-white"
                        >
                            <Search size={24} />
                        </button>
                    ) : (
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-10 pr-2 py-1 w-48 rounded-md text-sm shadow-md border border-gray-300"
                                autoFocus
                            />
                            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
                            <button
                                onClick={() => setShowMobileSearch(false)}
                                className="text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menú de navegación */}
            <ul className="hidden sm:flex gap-7 text-white text-sm my-7">
                <div className="relative group">
                    <Link to="#" className="px-4 py-4 flex items-center gap-1">
                        Categorías
                        <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </Link>
                    <div className="absolute hidden group-hover:block bg-slate-900 text-white rounded-md -my-2 px-3 -mx-5 z-10">
                        <Link to="/productos" className="block my-3 px-9 py-2 hover:bg-sky-800">Electrónica</Link>
                        <Link to="/productos/Moda" className="block my-3 px-9 py-2 hover:bg-sky-800">Moda</Link>
                        <Link to="/productos/hogar" className="block my-3 px-9 py-2 hover:bg-sky-800">Hogar</Link>
                        <Link to="/productos/tecnologia" className="block my-3 px-9 py-2 hover:bg-sky-800">Tecnología</Link>
                        <Link to="/productos/belleza" className="block my-3 px-9 py-2 hover:bg-sky-800">Belleza</Link>
                        <Link to="/productos/hogar" className="block my-3 px-9 py-2 hover:bg-sky-800">Mascotas</Link>
                        <Link to="/productos/bebes" className="block my-3 px-9 py-2 hover:bg-sky-800">Bebés</Link>
                        <Link to="/productos/herramientas" className="block my-3 px-9 py-2 hover:bg-sky-800">Herramientas</Link>
                        <Link to="/productos/construccion" className="block my-3 px-9 py-2 hover:bg-sky-800">Construcción</Link>
                    </div>
                </div>
                <Link to="/" className="px-4 py-4">Inicio</Link>
                <Link to="/log_in" className="px-4 py-4">Iniciar sesión</Link>
                <Link to="/nosotros" className="px-4 py-4">Nosotros</Link>
                <Link to="/registro" className="px-4 py-4">Registrarse</Link>
            </ul>
        </div>
    );
};

export default Navbar;
