import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductReviews, createReview, updateReview, deleteReview } from '../api/reviewService';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Simular usuario actual (esto debería venir de tu sistema de autenticación)
  const currentUser = {
    id: 'user123',
    name: 'Usuario Ejemplo'
  };

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

    const fetchReviews = async () => {
      try {
        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);
        // Buscar si el usuario actual ya tiene una reseña
        const userReview = reviewsData.find(review => review.userId === currentUser.id);
        if (userReview) {
          setUserReview(userReview);
          setRating(userReview.rating);
          setComment(userReview.comment);
        }
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment
      };

      if (userReview) {
        // Actualizar reseña existente
        await updateReview(id, reviewData);
        setIsEditing(false);
      } else {
        // Crear nueva reseña
        await createReview(id, reviewData);
      }

      // Recargar reseñas
      const updatedReviews = await getProductReviews(id);
      setReviews(updatedReviews);
      const newUserReview = updatedReviews.find(review => review.userId === currentUser.id);
      setUserReview(newUserReview);
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      alert('Error al guardar la reseña. Por favor, intenta de nuevo.');
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu reseña?')) {
      try {
        await deleteReview(id, currentUser.id);
        setUserReview(null);
        setRating(5);
        setComment('');
        const updatedReviews = await getProductReviews(id);
        setReviews(updatedReviews);
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        alert('Error al eliminar la reseña. Por favor, intenta de nuevo.');
      }
    }
  };

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

      {/* Sección de Reseñas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reseñas y Calificaciones</h2>
        
        {/* Formulario de Reseña */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {userReview ? 'Editar tu reseña' : 'Deja tu reseña'}
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calificación</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comentario</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-lg"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {userReview ? 'Actualizar' : 'Publicar'}
              </button>
              {userReview && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Reseñas */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{review.userName}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay reseñas para este producto aún.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;