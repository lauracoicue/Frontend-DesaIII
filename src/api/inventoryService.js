import axios from 'axios';

const API_URL = 'http://localhost:8081/api/productos';

// Configuración de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para logging de requests
api.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data
    });
    return request;
});

// Interceptor para logging de responses
api.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });
        return Promise.reject(error);
    }
);

// Obtener todos los productos
export const getAllProducts = async () => {
    try {
        console.log('Fetching all products from:', `${API_URL}/`);
        const response = await api.get('/');
        console.log('Products received:', response.data);
        if (!Array.isArray(response.data)) {
            throw new Error('La respuesta no es un array de productos');
        }
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            stack: error.stack
        });
        throw new Error(error.response?.data?.message || 'No se pudieron cargar los productos. Por favor, intente nuevamente.');
    }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener producto:', error);
        throw error;
    }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
    try {
        const response = await api.post('/crear', productData);
        return response.data;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
};

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
};

// Actualizar el stock de un producto
export const updateStock = async (id, newStock) => {
    try {
        console.log('Actualizando stock:', { id, newStock });
        const response = await api.post(`/${id}/stock`, { cantidad: newStock });
        console.log('Stock actualizado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        const errorMessage = error.response?.data?.mensaje || 'No se pudo actualizar el stock. Por favor, intente nuevamente.';
        throw new Error(errorMessage);
    }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
};

// Verificar productos con stock bajo
export const checkLowStock = (products, threshold = 5) => {
    return products.filter(product => product.cantidad < threshold);
};

// Función para manejar la sincronización de stock después de una venta
export const syncStockAfterSale = async (productId, quantitySold) => {
    try {
        const product = await getProductById(productId);
        const newStock = product.cantidad - quantitySold;
        return await updateStock(productId, newStock);
    } catch (error) {
        console.error('Error al sincronizar stock:', error);
        throw error;
    }
};

// Función para obtener el estado de disponibilidad
export const getAvailabilityStatus = (stock) => {
    return stock > 0 ? 'Disponible' : 'No disponible';
};

// Función para validar datos del producto
export const validateProductData = (productData) => {
    const errors = [];
    
    if (!productData.nombre) errors.push('El nombre es requerido');
    if (!productData.precio || productData.precio <= 0) errors.push('El precio debe ser mayor a 0');
    if (productData.cantidad < 0) errors.push('El stock no puede ser negativo');
    if (!productData.categoria) errors.push('La categoría es requerida');
    
    return {
        isValid: errors.length === 0,
        errors
    };
}; 