import React, { useState } from 'react';

const Editor_produc = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Camiseta', price: 20, description: 'Camiseta básica', stock: 10, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Pantalón', price: 40, description: 'Pantalón de mezclilla', stock: 5, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Zapatos', price: 60, description: 'Zapatos deportivos', stock: 8, image: 'https://via.placeholder.com/150' },
  ]);

  const [formData, setFormData] = useState({ id: null, name: '', price: '', description: '', stock: '', image: '' });
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState('add');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAdd = () => {
    if (!formData.name || !formData.price || !formData.description || !formData.stock || !formData.image) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const newProduct = { ...formData, id: Date.now() };
    setProducts([...products, newProduct]);
    setFormData({ id: null, name: '', price: '', description: '', stock: '', image: '' });
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setMode('edit');
    setShowForm(true);
  };

  const handleUpdate = () => {
    setProducts(products.map(p => p.id === formData.id ? formData : p));
    setFormData({ id: null, name: '', price: '', description: '', stock: '', image: '' });
    setShowForm(false);
    setMode('add');
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r min-h-screen bg-blue-50" onPaste={handlePasteImage}>
      <h1 className="text-4xl font-bold mb-10 text-center">Catálogo de Productos</h1>

      <div className="flex justify-center mb-11">
        <button
          onClick={() => { setShowForm(true); setMode('add'); setFormData({ id: null, name: '', price: '', description: '', stock: '', image: '' }); }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Agregar Producto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition">
            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-semibold mt-2">Precio: ${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">Editar</button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 px-10 rounded-lg shadow-lg w-[36rem] max-w-full">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{mode === 'add' ? 'Agregar Producto' : 'Editar Producto'}</h2>
            <div className="space-y-3">
              <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" />
              <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} className="border p-2 w-full rounded" />
              <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" />
              <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="border p-2 w-full rounded" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 w-full rounded" />
              {formData.image && <img src={formData.image} alt="Previsualización" className="w-24 h-24 object-cover rounded mx-auto" />}
              <button
                onClick={mode === 'add' ? handleAdd : handleUpdate}
                className={`w-full py-2 rounded text-white ${mode === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {mode === 'add' ? 'Agregar' : 'Actualizar'}
              </button>
              <button onClick={() => setShowForm(false)} className="w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100">
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
