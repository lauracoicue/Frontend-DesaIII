import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/product/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el producto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const agregarAlCarrito = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/productos/carrito/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'user123' // Esto debería venir de tu sistema de autenticación
        },
        body: JSON.stringify({ cantidad: quantity })
      });

      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }

      alert('Producto agregado al carrito');
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al agregar el producto al carrito');
    }
  };

  const incrementarCantidad = () => {
    if (product && quantity < product.cantidad) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementarCantidad = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <p className="text-lg">Cargando producto...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
      <p>Error: {error}</p>
    </div>
  );

  if (!product) return (
    <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
      <p>Producto no encontrado</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-900 hover:underline mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img 
          src={product.imagenUrl} 
          alt={product.nombre} 
          className="w-full rounded-2xl shadow-md object-contain h-96" 
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.nombre}</h1>
          <p className="text-gray-600 mb-4">{product.descripcion}</p>
          <p className="text-2xl font-semibold text-green-600 mb-2">${product.precio}</p>
          <p className="text-sm text-gray-500 mb-6">
            Stock disponible: {product.cantidad}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button 
                onClick={decrementarCantidad}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={incrementarCantidad}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={agregarAlCarrito}
            className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-700 transition w-full"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;