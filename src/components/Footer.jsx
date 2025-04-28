import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-6 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
       
        <div>
          <h2 className="text-xl font-bold">Nuestra Tienda</h2>
          <p className="text-sm mt-2">
            Compra de manera fácil y segura con los mejores productos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Enlaces Rápidos</h2>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-400">Inicio</Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-gray-400">Nosotros</Link>
            </li>
            <li>
              <Link to="/registro" className="hover:text-gray-400">Registrarse</Link>
            </li>
            <li>
              <Link to="/log_in" className="hover:text-gray-400">Iniciar sesión</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold">Contacto</h2>
          <p className="text-sm mt-2">📍 Calle 123, Ciudad, País</p>
          <p className="text-sm mt-2">📧 contacto@tienda.com</p>
          <p className="text-sm mt-2">📞 +123 456 7890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Nuestra Tienda - Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
