import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import galaxy from "../img_productos/galaxy.jpg";

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Obtener productos del carrito desde el backend
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:8089/api/productos/carrito', {
          headers: {
            'X-User-Id': user.id
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
  }, [user]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!user) {
      navigate('/log_in');
      return;
    }

    if (newQuantity < 1) {
        alert('La cantidad no puede ser menor a 1');
        return;
    }

    try {
      // Primero encontramos el item del carrito para obtener el productId
      const cartItem = cart.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Item no encontrado en el carrito');
      }

      const response = await fetch(`http://localhost:8089/api/productos/carrito/${cartItem.product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify({ cantidad: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la cantidad');
      }

      const updatedItem = await response.json();
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === cartItemId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      alert('Error al actualizar la cantidad del producto');
    }
  };

  const removeItem = async (cartItemId) => {
    if (!user) {
      navigate('/log_in');
      return;
    }

    try {
      // Primero encontramos el item del carrito para obtener el productId
      const cartItem = cart.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Item no encontrado en el carrito');
      }

      const response = await fetch(`http://localhost:8089/api/productos/carrito/${cartItem.product.id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': user.id
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto del carrito');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg mb-4">Debes iniciar sesión para ver tu carrito de compras</p>
        <button
          onClick={() => navigate('/log_in')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

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
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío.</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={item.product.imagenUrl || galaxy}
                  alt={item.product.nombre} 
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    console.error('Error al cargar la imagen:', item.product.imagenUrl);
                    e.target.onerror = null;
                    e.target.src = galaxy;
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.nombre}</h3>
                  <p className="text-gray-600">Precio: ${item.product.precio.toFixed(2)}</p>
                  <p className="text-gray-600">Subtotal: ${(item.product.precio * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="ml-4 text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-semibold mt-6">
            Total: ${total.toFixed(2)}
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