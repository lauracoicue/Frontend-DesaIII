import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Simulando fetch del producto
  useEffect(() => {
    // Aquí irá el llamado real al backend
    // Por ahora solo un ejemplo
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // const response = await fetch('/api/product/1');
        // const data = await response.json();
        const data = {
          id: 1,
          name: 'Producto de ejemplo',
          description: 'Este es un producto de prueba con detalles.',
          price: 129.99,
          imageUrl: 'https://via.placeholder.com/400',
          stock: 25
        };
        setProduct(data);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Cargando...</div>;
  if (!product) return <div className="text-center mt-10 text-red-500">Producto no encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.imageUrl} alt={product.name} className="w-full rounded-2xl shadow-md" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mb-2">${product.price}</p>
          <p className="text-sm text-gray-500 mb-6">Stock disponible: {product.stock}</p>


          <button className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-700 transition">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;