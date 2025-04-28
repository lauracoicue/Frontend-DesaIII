import React, { useState, useEffect } from 'react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Camiseta Algodón', stock: 50, lowStockThreshold: 10 },
    { id: 2, name: 'Pantalón Jean', stock: 25, lowStockThreshold: 5 },
    { id: 3, name: 'Zapatillas Deportivas', stock: 5, lowStockThreshold: 8 },
    { id: 4, name: 'Gorra de Béisbol', stock: 100, lowStockThreshold: 15 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [editingId, setEditingId] = useState(null);
  const [editedStock, setEditedStock] = useState('');

  useEffect(() => {
    // Aquí podrías tener lógica para verificar la autenticación del administrador
    // Por ahora, asumimos que el acceso a este componente ya está protegido.
  }, []);

  useEffect(() => {
    const results = inventory.filter(item =>
      item.id.toString().includes(searchTerm)
    );
    setFilteredInventory(results);
  }, [searchTerm, inventory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
      item.id.toString().includes(searchTerm)
    ));
    setEditingId(null);
    setEditedStock('');
    // Aquí podrías llamar a una API para guardar los cambios en el backend
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

      <div className="mb-4">
        <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
          Buscar por ID:
        </label>
        <input
          type="text"
          id="search"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Ingrese el ID del producto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Producto</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
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
              <td className="border border-gray-300 px-4 py-2">
                {editingId !== item.id && (
                  <button onClick={() => handleEdit(item.id, item.stock)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md">Editar</button>
                )}
              </td>
            </tr>
          ))}
          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                No se encontraron productos con el ID: {searchTerm}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;