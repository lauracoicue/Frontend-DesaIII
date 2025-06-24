import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8090/api/productos';

const Editor_produc = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    precio: '',
    descripcion: '',
    cantidad: '',
    imagen: null,
    imagenPreview: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState('add');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagenPreview: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const buildFormData = () => {
    const form = new FormData();
    form.append('nombre', formData.nombre);
    form.append('descripcion', formData.descripcion);
    form.append('precio', formData.precio);
    form.append('cantidad', formData.cantidad);
    if (formData.imagen) {
      form.append('imagen', formData.imagen);
    }
    return form;
  };

  const handleAdd = async () => {
    if (!formData.nombre || !formData.precio || !formData.descripcion || !formData.cantidad) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        body: buildFormData(),
        // No agregues headers para FormData, el navegador los establecerá automáticamente
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }

      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      resetForm();
      loadProducts(); // Recargar productos para asegurar consistencia
    } catch (error) {
      console.error(error);
      alert(error.message || 'No se pudo crear el producto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      cantidad: product.cantidad,
      imagen: null,
      imagenPreview: product.imagenUrl || ''
    });
    setMode('edit');
    setShowForm(true);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${formData.id}`, {
        method: 'PUT',
        body: buildFormData()
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      const updated = await res.json();
      setProducts(products.map(p => p.id === updated.id ? updated : p));
      resetForm();
      loadProducts(); // Recargar productos para asegurar consistencia
    } catch (error) {
      console.error(error);
      alert(error.message || 'No se pudo actualizar el producto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert(error.message || 'No se pudo eliminar el producto.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      id: null, 
      nombre: '', 
      precio: '', 
      descripcion: '', 
      cantidad: '', 
      imagen: null, 
      imagenPreview: '' 
    });
    setShowForm(false);
    setMode('add');
  };

  return (
    <div className="p-8 bg-gradient-to-r min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-10 text-center">Catálogo de Productos</h1>

      <div className="flex justify-center mb-11">
        <button
          onClick={() => { setShowForm(true); setMode('add'); resetForm(); }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : '+ Agregar Producto'}
        </button>
      </div>

      {isLoading && !showForm ? (
        <div className="text-center">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition">
              {product.imagenUrl && (
                <img 
                  src={product.imagenUrl} 
                  alt={product.nombre} 
                  className="w-32 h-32 object-cover rounded-md mb-4" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              )}
              <h2 className="text-lg font-bold text-gray-800">{product.nombre}</h2>
              <p className="text-gray-600">{product.descripcion}</p>
              <p className="font-semibold mt-2">Precio: ${product.precio}</p>
              <p className="text-sm text-gray-500">Stock: {product.cantidad}</p>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleEdit(product)} 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  disabled={isLoading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(product.id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  disabled={isLoading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 px-10 rounded-lg shadow-lg w-[36rem] max-w-full">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">
              {mode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
            </h2>
            <div className="space-y-3">
              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                required
              />
              <input 
                type="number" 
                name="precio" 
                placeholder="Precio" 
                value={formData.precio} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                min="0" 
                step="0.01" 
                required
              />
              <textarea 
                name="descripcion" 
                placeholder="Descripción" 
                value={formData.descripcion} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                required
              />
              <input 
                type="number" 
                name="cantidad" 
                placeholder="Stock" 
                value={formData.cantidad} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                min="0" 
                required
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="border p-2 w-full rounded" 
              />
              {formData.imagenPreview && (
                <img 
                  src={formData.imagenPreview} 
                  alt="Previsualización" 
                  className="w-24 h-24 object-cover rounded mx-auto" 
                />
              )}
              <button
                onClick={mode === 'add' ? handleAdd : handleUpdate}
                className={`w-full py-2 rounded text-white ${mode === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : (mode === 'add' ? 'Agregar' : 'Actualizar')}
              </button>
              <button 
                onClick={resetForm} 
                className="w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor_produc;