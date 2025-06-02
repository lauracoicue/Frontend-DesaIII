import React, { useState, useEffect } from 'react';
import { 
    getAllProducts, 
    updateStock, 
    checkLowStock,
    getAvailabilityStatus 
} from '../api/inventoryService';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedStock, setEditedStock] = useState('');
  const [availableCategories, setAvailableCategories] = useState(['all']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await getAllProducts();
      setInventory(products);
      setFilteredInventory(products);
      // Extraer categorías únicas
      const categories = ['all', ...new Set(products.map(item => item.categoria))];
      setAvailableCategories(categories);
    } catch (error) {
      setError('Error al cargar los productos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = inventory.filter(item =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm)
    );

    if (stockFilter === 'low') {
      results = results.filter(item => item.cantidad < 5); // Usando el umbral de 5 unidades
    } else if (stockFilter === 'high') {
      results = results.filter(item => item.cantidad >= 5);
    }

    if (categoryFilter !== 'all') {
      results = results.filter(item => item.categoria === categoryFilter);
    }

    setFilteredInventory(results);
  }, [searchTerm, stockFilter, categoryFilter, inventory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleEdit = (id, currentStock) => {
    setEditingId(id);
    setEditedStock(currentStock.toString());
  };

  const handleSave = async (id) => {
    try {
      const newStock = parseInt(editedStock, 10);
      if (isNaN(newStock) || newStock < 0) {
        setError('El stock debe ser un número positivo');
        return;
      }

      await updateStock(id, newStock);
      await loadProducts(); // Recargar productos después de actualizar
      setEditingId(null);
      setEditedStock('');
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al actualizar el stock');
      console.error('Error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedStock('');
    setError(null);
  };

  const handleStockChange = (event) => {
    setEditedStock(event.target.value);
  };

  const isLowStock = (stock) => {
    return stock < 5; // Usando el umbral de 5 unidades
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <p className="text-lg">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-4 flex space-x-4">
        <div className="w-1/3">
          <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
            Buscar producto:
          </label>
          <input
            type="text"
            id="search"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Buscar por nombre o ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="w-1/3">
          <label htmlFor="stockFilter" className="block text-gray-700 text-sm font-bold mb-2">
            Filtrar por Stock:
          </label>
          <select
            id="stockFilter"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stockFilter}
            onChange={handleStockFilterChange}
          >
            <option value="all">Todos los Stocks</option>
            <option value="low">Stock Bajo</option>
            <option value="high">Stock Suficiente</option>
          </select>
        </div>

        <div className="w-1/3">
          <label htmlFor="categoryFilter" className="block text-gray-700 text-sm font-bold mb-2">
            Filtrar por Categoría:
          </label>
          <select
            id="categoryFilter"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las Categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Producto</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Categoría</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id} className={isLowStock(item.cantidad) ? 'bg-yellow-100' : ''}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editingId === item.id ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={editedStock}
                      onChange={handleStockChange}
                      className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right"
                      min="0"
                    />
                    <button 
                      onClick={() => handleSave(item.id)} 
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md ml-2"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={handleCancelEdit} 
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded-md ml-1"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    {item.cantidad}
                    {isLowStock(item.cantidad) && (
                      <span className="text-red-500 ml-2 font-semibold">¡Stock Bajo!</span>
                    )}
                  </>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getAvailabilityStatus(item.cantidad)}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.categoria}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editingId !== item.id && (
                  <button 
                    onClick={() => handleEdit(item.id, item.cantidad)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md"
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                No se encontraron productos con los filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;