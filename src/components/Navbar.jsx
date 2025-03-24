import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw] w-full lg:flex h-36 bg-blue-950 flex justify-between">
            {/* Hacer que el logo redirija a Home */}
            <Link to="/home">
                <img src={logo} alt="Logo" className="size-32 mx-30 cursor-pointer" />
            </Link>

            <ul className="hidden sm:flex gap-5 text-white text-sm my-7">
                <Link to="/home" className="px-4 py-4">Inicio</Link>
                <Link to="/log_in" className="px-4 py-4">Iniciar sesión</Link>
                <Link to="/nosotros" className="px-4 py-4">Nosotros</Link>
                <Link to="/registrarse" className="px-4 py-4">Registrarse</Link>
            </ul>
        </div>
    );
};

export default Navbar;
