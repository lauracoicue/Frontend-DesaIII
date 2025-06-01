import React from "react";
import logo from "../assets/tienda-online-ERP-ventas.jpg";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";

const Home = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl text-center">
                <h1 className="text-4xl font-bold text-gray-800">Bienvenido a Nuestra Tienda</h1>
                <p className="text-gray-600 mt-4 text-lg">Descubre productos exclusivos y compra de manera fácil y segura desde la comodidad de tu hogar.</p>
            </div>

            {/* Sección de Imagen Principal */}
            <div className="w-full max-w-4xl mt-6 flex items-center justify-center">
                <img src={logo} alt="Tienda" className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>

            {/* Sección de Características */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white shadow-lg rounded-lg">
                    <img src={image1} alt="Calidad Garantizada" className="w-full h-32 object-cover rounded-md" />
                    <h2 className="text-xl font-semibold mt-4">Calidad Garantizada</h2>
                    <p className="text-gray-600 text-sm mt-2">Productos cuidadosamente seleccionados para ofrecerte lo mejor.</p>
                </div>
                <div className="p-4 bg-white shadow-lg rounded-lg">
                    <img src={image2} alt="Envío Rápido" className="w-full h-32 object-cover rounded-md" />
                    <h2 className="text-xl font-semibold mt-4">Envío Rápido</h2>
                    <p className="text-gray-600 text-sm mt-2">Recibe tus compras en tiempo récord con nuestro servicio de entrega eficiente.</p>
                </div>
                <div className="p-4 bg-white shadow-lg rounded-lg">
                    <img src={image3} alt="Atención Personalizada" className="w-full h-32 object-cover rounded-md" />
                    <h2 className="text-xl font-semibold mt-4">Atención Personalizada</h2>
                    <p className="text-gray-600 text-sm mt-2">Nuestro equipo está disponible para ayudarte en cada paso de tu compra.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
