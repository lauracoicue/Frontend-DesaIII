// src/components/DetalleProducto.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getProductReviews, createReview, deleteReview } from '../api/reviewService';
import galaxy from "../img_productos/galaxy.jpg";
import audionofo from "../img_productos/audifonos.jpg";
import laptop from "../img_productos/laptop.jpg";
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Simular usuario actual (esto debería venir de tu sistema de autenticación)
  const currentUser = {
    id: 'user123',
    name: 'Usuario Ejemplo'
  };

  const stock = 12;
  const colores = ["Negro", "Azul", "Rojo"];
  const metodoPago = "Tarjeta, Efectivo, Transferencia";

  const relacionados = productos.filter((p) => p.id !== parseInt(id)).slice(0, 3);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await getProductReviews(id);
      setReviews(data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
      setError(error.message || 'Error al cargar las reseñas');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        userId: 1, // ID del usuario actual (hardcodeado para pruebas)
        product: {
          id: parseInt(id)
        },
        rating: parseInt(rating),
        comment,
        verifiedPurchase: true // Para pruebas, asumimos que es una compra verificada
      };

      await createReview(newReview);
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      setError(null);
      await fetchReviews(); // Recargar todas las reseñas
    } catch (error) {
      console.error('Error al crear la reseña:', error);
      setError(error.message || 'Error al crear la reseña');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setError(null);
      await fetchReviews(); // Recargar todas las reseñas
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      setError(error.message || 'Error al eliminar la reseña');
    }
  };

  const irADetalle = (producto) => {
    navigate(`/productos/${producto.id}`, { state: producto });
  };

  const agregarAlCarrito = async () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/log_in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8089/api/productos/carrito/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify({ cantidad: 1 })
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

  if (!producto) {
    return <p className="p-6 text-red-600">Producto no encontrado.</p>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <img
          src={producto.imagenUrl || galaxy}
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
            onClick={agregarAlCarrito}
            className="bg-blue-400 hover:bg-blue-800 text-white py-2 px-6 rounded w-full text-lg"
          >
            Agregar al carrito
          </button>
          <button 
            onClick={() => {
              agregarAlCarrito();
              navigate('/carrito');
            }}
            className="bg-blue-950 hover:bg-blue-900 text-white py-2 px-6 my-4 rounded w-full text-lg"
          >
            Comprar ahora
          </button>
        </div>
      </div>

      {/* Sección de reseñas */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reseñas</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulario para nueva reseña */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Escribe una reseña</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calificación:</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded"
                disabled={isSubmitting}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? 'estrella' : 'estrellas'}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comentario:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2 border rounded"
                rows="4"
                placeholder="Escribe tu reseña aquí (máximo 500 caracteres)"
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                {comment.length}/500 caracteres
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar reseña'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de reseñas */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay reseñas para este producto aún.
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold">{currentUser.name}</span>
                      <span className="mx-2">•</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                  {review.userId === currentUser.id && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
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
                src={rel.imagenUrl || galaxy}
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
