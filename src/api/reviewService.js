import axios from 'axios';

const API_URL = 'http://localhost:8081/api/reviews';

export const getProductReviews = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || error.response.data || 'Error al cargar las reseñas');
        }
        throw new Error('Error de conexión al cargar las reseñas');
    }
};

export const createReview = async (review) => {
    try {
        // Asegurarnos de que los datos estén en el formato correcto
        const reviewData = {
            userId: review.userId,
            product: {
                id: review.product.id
            },
            rating: review.rating,
            comment: review.comment,
            verifiedPurchase: review.verifiedPurchase
        };

        const response = await axios.post(API_URL, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || error.response.data || 'Error al crear la reseña');
        }
        throw new Error('Error de conexión al crear la reseña');
    }
};

export const getUserReviews = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las reseñas del usuario:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || error.response.data || 'Error al cargar las reseñas del usuario');
        }
        throw new Error('Error de conexión al cargar las reseñas del usuario');
    }
};

export const deleteReview = async (reviewId) => {
    try {
        await axios.delete(`${API_URL}/${reviewId}`);
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || error.response.data || 'Error al eliminar la reseña');
        }
        throw new Error('Error de conexión al eliminar la reseña');
    }
}; 