import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductReviews, createReview, deleteReview } from '../api/reviewService';
import axios from 'axios';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // Simular usuario actual (esto debería venir de tu sistema de autenticación)
  const currentUser = {
    id: 'user123',
    name: 'Usuario Ejemplo'
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8089/api/productos/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    // Implementar lógica para agregar al carrito
    console.log('Agregar al carrito:', { productId: id, quantity });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        userId: currentUser.id,
        productId: id,
        rating,
        comment,
        verifiedPurchase: true // Por ahora siempre true para pruebas
      };

      const createdReview = await createReview(newReview);
      setReviews([...reviews, createdReview]);
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Error al crear la reseña:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="relative">
          <img
            src={product.imagenUrl || 'https://via.placeholder.com/400'}
            alt={product.nombre}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.nombre}</h1>
          <p className="text-2xl font-semibold text-blue-600">${product.precio}</p>
          <p className="text-gray-600">{product.descripcion}</p>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="font-medium">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Sección de reseñas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reseñas</h2>

        {/* Formulario para nueva reseña */}
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Escribe una reseña</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Calificación:</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded"
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
            />
            <p className="text-sm text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Publicar reseña
          </button>
        </form>

        {/* Lista de reseñas */}
        <div className="space-y-6">
          {reviews.map((review) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;