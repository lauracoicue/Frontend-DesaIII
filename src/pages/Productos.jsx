import React from "react";
import galaxy from "../img_productos/galaxy.jpg";
import audionofo from "../img_productos/audifonos.jpg";
import laptop from "../img_productos/laptop.jpg";
import { useNavigate } from "react-router-dom";

/*
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Productos = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/productos/categoria/${categoria}`)
      .then(response => setProductos(response.data))
      .catch(error => console.error("Error al obtener productos", error));
  }, [categoria]);

///////////////////Opcion 2 ////////////////////////////////////}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Productos = () => {
  const { categoria } = useParams(); // <- AQUÍ SE LEE DE LA URL
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/productos/${categoria}`);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, [categoria]);
*/

// src/components/Productos.jsx

const productosElementos = [
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
  },
  {
    id: 4,
    nombre: "Iphone",
    precio: "$450",
    img: galaxy,
    descripcion: "Pantalla AMOLED, 128GB de almacenamiento y cámara de 64MP"
  },
  {
    id: 5,
    nombre: "Laptop ASUS",
    precio: "$900",
    img: laptop,
    descripcion: "Procesador Intel i7, 16GB RAM, SSD 512GB, ideal para trabajo"
  },
  {
    id: 6,
    nombre: "Audífonos Inalambricos",
    precio: "$60",
    img: audionofo,
    descripcion: "Conectividad inalámbrica y cancelación de ruido"
  }
];

const Productos = () => {
  const navigate = useNavigate();

  const irADetalle = (producto) => {
    navigate(`/detalle/${producto.id}`, { state: producto });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Electrónica</h1>
      <p className="text-gray-700 mb-6">
        Explora los mejores productos de electrónica con tecnología de punta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosElementos.map((producto) => (
          <div
            key={producto.id}
            onClick={() => irADetalle(producto)}
            className="border rounded-xl shadow hover:shadow-md transition p-4 cursor-pointer"
            title={producto.descripcion}
          >
            <img
              src={producto.img}
              alt={producto.nombre}
              className="w-full h-40 object-contain mb-3 rounded"
            />
            <p className="text-gray-600 text-sm mt-2">{producto.descripcion}</p>
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-green-600 font-medium">{producto.precio}</p>
            <div className="flex justify-end mt-4">
            <button
              onClick={() => agregarAlCarrito(producto)}
              className="text-white mx-3 rounded size-8">
              <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" className="">
                <path d="m23.918,4H4.49l-.256-1.843c-.17-1.229-1.234-2.157-2.476-2.157H0v1h1.759c.745,0,1.383.556,1.485,1.294l2.021,14.549c.17,1.229,1.234,2.157,2.476,2.157h12.259v-1H7.741c-.745,0-1.383-.556-1.485-1.294l-.237-1.706h15.699l2.2-11ZM5.88,14l-1.25-9h18.068l-1.8,9H5.88Zm1.12,6c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Zm10-3c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm0,3c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"/>
              </svg>
            </button>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;

