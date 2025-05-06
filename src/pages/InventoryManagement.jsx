import React, { useState, useEffect } from 'react';

const InventoryManagement = () => {
  const initialInventory = [
    { id: 1, name: 'Camiseta Algodón', stock: 50, lowStockThreshold: 10, category: 'Ropa' },
    { id: 2, name: 'Pantalón Jean', stock: 25, lowStockThreshold: 5, category: 'Ropa' },
    { id: 3, name: 'Zapatillas Deportivas', stock: 5, lowStockThreshold: 8, category: 'Calzado' },
    { id: 4, name: 'Gorra de Béisbol', stock: 100, lowStockThreshold: 15, category: 'Accesorios' },
    { id: 5, name: 'Calcetines Deportivos', stock: 15, lowStockThreshold: 20, category: 'Ropa' },
    { id: 6, name: 'Botas de Montaña', stock: 8, lowStockThreshold: 12, category: 'Calzado' },
    { id: 7, name: 'Bufanda de Lana', stock: 30, lowStockThreshold: 10, category: 'Accesorios' },
  ];

  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredInventory, setFilteredInventory] = useState(initialInventory);
  const [editingId, setEditingId] = useState(null);
  const [editedStock, setEditedStock] = useState('');
  const [availableCategories, setAvailableCategories] = useState(['all', ...new Set(initialInventory.map(item => item.category))]);

  useEffect(() => {
    // Aquí podrías tener lógica para verificar la autenticación del administrador
  }, []);

  useEffect(() => {
    let results = inventory.filter(item =>
      item.id.toString().includes(searchTerm)
    );

    if (stockFilter === 'low') {
      results = results.filter(item => item.stock <= item.lowStockThreshold);
    } else if (stockFilter === 'high') {
      results = results.filter(item => item.stock > item.lowStockThreshold);
    }

    if (categoryFilter !== 'all') {
      results = results.filter(item => item.category === categoryFilter);
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

  const handleSave = (id) => {
    const updatedInventory = inventory.map(item =>
      item.id === id ? { ...item, stock: parseInt(editedStock, 10) } : item
    );
    setInventory(updatedInventory);
    setFilteredInventory(updatedInventory.filter(item =>
      item.id.toString().includes(searchTerm) &&
      (stockFilter === 'all' || (stockFilter === 'low' ? item.stock <= item.lowStockThreshold : item.stock > item.lowStockThreshold)) &&
      (categoryFilter === 'all' || item.category === categoryFilter)
    ));
    setEditingId(null);
    setEditedStock('');
    // Llamada a la API para guardar los cambios
    console.log(`Inventario del producto ${id} actualizado a ${editedStock}`);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedStock('');
  };

  const handleStockChange = (event) => {
    setEditedStock(event.target.value);
  };

  const isLowStock = (stock, threshold) => {
    return stock <= threshold;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>

      <div className="mb-4 flex space-x-4">
        <div className="w-1/3">
          <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
            Buscar por ID:
          </label>
          <input
            type="text"
            id="search"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingrese el ID"
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
            <option value="all">Todas las Categorías</option>
            {availableCategories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
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
            <th className="border border-gray-300 px-4 py-2">Categoría</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id} className={isLowStock(item.stock, item.lowStockThreshold) ? 'bg-yellow-100' : ''}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editingId === item.id ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={editedStock}
                      onChange={handleStockChange}
                      className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right"
                    />
                    <button onClick={() => handleSave(item.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md ml-2">Guardar</button>
                    <button onClick={handleCancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded-md ml-1">Cancelar</button>
                  </div>
                ) : (
                  <>
                    {item.stock}
                    {isLowStock(item.stock, item.lowStockThreshold) && (
                      <span className="text-red-500 ml-2 font-semibold">¡Stock Bajo!</span>
                    )}
                  </>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editingId !== item.id && (
                  <button onClick={() => handleEdit(item.id, item.stock)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md">Editar</button>
                )}
              </td>
            </tr>
          ))}
          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
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