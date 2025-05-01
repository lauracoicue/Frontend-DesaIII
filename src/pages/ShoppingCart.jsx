import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener productos del carrito desde el backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8081/api/productos/carrito', {
          headers: {
            'X-User-Id': 'user123' // Esto debería venir de tu sistema de autenticación
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los productos del carrito');
        }
        const data = await response.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (id, amount) => {
    try {
      const response = await fetch(`http://localhost:8081/api/productos/carrito/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'user123' // Esto debería venir de tu sistema de autenticación
        },
        body: JSON.stringify({ cantidad: amount }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la cantidad');
      }

      const updatedItem = await response.json();
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      alert('Error al actualizar la cantidad del producto');
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/productos/carrito/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': 'user123' // Esto debería venir de tu sistema de autenticación
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto del carrito');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

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

      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <img src={item.product.imagenUrl} alt={item.product.nombre} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.nombre}</h3>
                  <p className="text-gray-600">Precio: ${item.product.precio}</p>
                  <p className="text-gray-600">Subtotal: ${item.product.precio * item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="px-3 py-1 bg-gray-300 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
                <button onClick={() => removeItem(item.product.id)} className="ml-4 text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-semibold mt-6">
            Total: ${total}
          </div>
          <div className="text-right mt-4">
            <button
              onClick={() => alert('Procediendo al pago...')}
              className="bg-green-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-green-700 transition"
            >
              Proceder con el pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;