// src/components/DetalleProducto.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import galaxy from "../img_productos/galaxy.jpg";
import audionofo from "../img_productos/audifonos.jpg";
import laptop from "../img_productos/laptop.jpg";

const productos = [
  {
    id: 1,
    nombre: "Smartphone Galaxy",
    precio: "$450",
    img: galaxy,
    descripcion: "Pantalla AMOLED, 128GB de almacenamiento y cámara de 64MP"
  },
  {
    id: 2,
    nombre: "Laptop Dell",
    precio: "$900",
    img: laptop,
    descripcion: "Procesador Intel i7, 16GB RAM, SSD 512GB, ideal para trabajo"
  },
  {
    id: 3,
    nombre: "Audífonos Bluetooth",
    precio: "$60",
    img: audionofo,
    descripcion: "Conectividad inalámbrica y cancelación de ruido"
  }
  
];

const DetalleProducto = () => {
  const { id } = useParams();
  const { state: producto } = useLocation();
  const navigate = useNavigate();

  const stock = 12;
  const colores = ["Negro", "Azul", "Rojo"];
  const metodoPago = "Tarjeta, Efectivo, Transferencia";

  const relacionados = productos.filter((p) => p.id !== parseInt(id)).slice(0, 3);

  const irADetalle = (producto) => {
    navigate(`/detalle/${producto.id}`, { state: producto });
  };

  if (!producto) {
    return <p className="p-6 text-red-600">Producto no encontrado.</p>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <img
          src={producto.img}
          alt={producto.nombre}
          className="w-full h-96 object-contain rounded"
        />

        <div className="bg-white shadow-md p-6 rounded-xl border">
          <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
          <p className="text-gray-700 mb-4">{producto.descripcion}</p>
          <p className="text-green-600 text-2xl font-semibold mb-4">{producto.precio}</p>

          <p className="mb-2">
            <strong>Métodos de pago:</strong> {metodoPago}
          </p>
          <p className="mb-2">
            <strong>Colores disponibles:</strong> {colores.join(", ")}
          </p>
          <p className="mb-4">
            <strong>Disponibilidad:</strong>{" "}
            <span className={stock > 0 ? "text-green-500" : "text-red-500"}>
              {stock > 0 ? "Disponible" : "Agotado"}
            </span>
          </p>
          <button 
          onClick={("")}
          className="bg-blue-400 hover:bg-blue-800 text-white py-2 px-6 rounded w-full text-lg ">
            Agregar al carrito
          </button>
          <button 
          onAbort={("")}
          className="bg-blue-950 hover:bg-blue-900 text-white py-2 px-6 my-4 rounded w-full text-lg">
            Comprar ahora
          </button>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Productos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relacionados.map((rel) => (
            <div
              key={rel.id}
              onClick={() => irADetalle(rel)}
              className="border rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={rel.img}
                alt={rel.nombre}
                className="w-full h-40 object-contain mb-3 rounded"
              />
              <h3 className="text-lg font-medium">{rel.nombre}</h3>
              <p className="text-sm text-gray-600">{rel.descripcion}</p>
              <p className="text-green-600 font-semibold">{rel.precio}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => irADetalle(rel)}
                  className="text-white mx-3 rounded size-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Outline"
                    viewBox="0 0 24 24"
                    className=""
                  >
                    <path d="m23.918,4H4.49l-.256-1.843c-.17-1.229-1.234-2.157-2.476-2.157H0v1h1.759c.745,0,1.383.556,1.485,1.294l2.021,14.549c.17,1.229,1.234,2.157,2.476,2.157h12.259v-1H7.741c-.745,0-1.383-.556-1.485-1.294l-.237-1.706h15.699l2.2-11ZM5.88,14l-1.25-9h18.068l-1.8,9H5.88Zm1.12,6c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Zm10-3c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
