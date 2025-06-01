// src/pages/Nosotros.jsx
import React from 'react';

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-blue-50 to-white flex flex-col items-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Conoce Nuestra Historia</h1>
        <p className="text-lg text-gray-600 text-center mb-10">
          En <span className="font-semibold">Nova</span>, nos apasiona conectar a vendedores y compradores de todo el país. Creamos un espacio donde puedes encontrar lo que necesitas de forma rápida, segura y confiable.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Nuestra Misión</h2>
            <p className="text-gray-600">
              Brindar una plataforma de ventas online accesible, confiable y con la mejor experiencia de usuario, conectando a millones de compradores y vendedores en todo el país.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Por Qué Elegirnos</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Variedad de productos y categorías</li>
              <li>Seguridad en cada transacción</li>
              <li>Atención al cliente personalizada</li>
              <li>Envíos rápidos a todo el país</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Compromiso</h2>
            <p className="text-gray-600">
              Trabajamos día a día para mejorar tu experiencia de compra y venta. Sabemos lo valioso que es tu tiempo y tu confianza, por eso cada paso está pensado para brindarte tranquilidad.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">¿Quieres ser parte de nuestra comunidad?</h3>
          <p className="text-gray-600 mb-4">Únete a nosotros y empieza a vender o comprar productos hoy mismo.</p>
          <a
            href="/registro"
            className="inline-block bg-blue-950 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-900 transition"
          >
            Crear cuenta gratis
          </a>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
