import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Simulación de productos en el carrito
  useEffect(() => {
    const storedCart = [
      {
        id: 1,
        name: 'Producto A',
        price: 100,
        quantity: 2,
        imageUrl: 'https://via.placeholder.com/100'
      },
      {
        id: 2,
        name: 'Producto B',
        price: 150,
        quantity: 1,
        imageUrl: 'https://via.placeholder.com/100'
      }
    ];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, amount) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Precio: ${item.price}</p>
                  <p className="text-gray-600">Subtotal: ${item.price * item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-300 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
                <button onClick={() => removeItem(item.id)} className="ml-4 text-red-600 hover:underline">Eliminar</button>
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