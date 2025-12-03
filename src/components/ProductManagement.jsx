import { useState, useEffect } from 'react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit_price: '',
    cost: '',
    stock: 0,
    unit: 'Pieza',
    is_service: false,
    is_active: true,
    tax_rate: 16.0,
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [filterActive]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products?active_only=${filterActive}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        code: product.code || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        unit_price: product.unit_price || '',
        cost: product.cost || '',
        stock: product.stock || 0,
        unit: product.unit || 'Pieza',
        is_service: product.is_service === 1,
        is_active: product.is_active === 1,
        tax_rate: product.tax_rate || 16.0,
        notes: product.notes || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        category: '',
        unit_price: '',
        cost: '',
        stock: 0,
        unit: 'Pieza',
        is_service: false,
        is_active: true,
        tax_rate: 16.0,
        notes: ''
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.code || !formData.name || !formData.unit_price) {
      setError('Código, nombre y precio son obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        handleCloseModal();
        fetchProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar producto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`¿Estás seguro de desactivar "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Producto desactivado correctamente');
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al desactivar producto');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const filteredProducts = products.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Catálogo de Productos y Servicios</h2>
            <p className="text-gray-600">Total: {products.length} items registrados</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 shadow-lg"
          >
            ➕ Nuevo Producto/Servicio
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, nombre, descripción o categoría..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
          </div>
          <label className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
            <input
              type="checkbox"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">Solo activos</span>
          </label>
        </div>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos aún'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer producto o servicio'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 card-hover ${
                !product.is_active ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      product.is_service ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    }`}>
                      {product.is_service ? '⚙️' : '📦'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                          {product.code}
                        </span>
                        {product.is_service ? (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                            Servicio
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            Producto
                          </span>
                        )}
                        {!product.is_active && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                            Inactivo
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 ml-15">
                    <div>
                      <p className="text-sm text-gray-500">💰 Precio Venta</p>
                      <p className="font-bold text-green-600 text-lg">{formatCurrency(product.unit_price)}</p>
                    </div>
                    {product.cost > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">💵 Costo</p>
                        <p className="font-medium text-gray-700">{formatCurrency(product.cost)}</p>
                      </div>
                    )}
                    {!product.is_service && (
                      <div>
                        <p className="text-sm text-gray-500">📊 Inventario</p>
                        <p className="font-medium text-gray-700">{product.stock} {product.unit}</p>
                      </div>
                    )}
                    {product.category && (
                      <div>
                        <p className="text-sm text-gray-500">🏷️ Categoría</p>
                        <p className="font-medium text-gray-700">{product.category}</p>
                      </div>
                    )}
                  </div>

                  {product.notes && (
                    <div className="mt-3 ml-15">
                      <p className="text-sm text-gray-500">📝 Notas</p>
                      <p className="text-gray-600 text-sm">{product.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    ✏️ Editar
                  </button>
                  {product.is_active && (
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                    >
                      ❌ Desactivar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 my-8 animate-slide-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Editar Producto/Servicio' : 'Nuevo Producto/Servicio'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo y estado */}
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_service"
                    checked={formData.is_service}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">Es un servicio</span>
                </label>
                {editingProduct && (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Activo</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código/SKU *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Electrónica, Software..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Venta *
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {!formData.is_service && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock/Inventario
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidad
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pieza">Pieza</option>
                      <option value="Caja">Caja</option>
                      <option value="Paquete">Paquete</option>
                      <option value="Metro">Metro</option>
                      <option value="Litro">Litro</option>
                      <option value="Kilogramo">Kilogramo</option>
                      <option value="Servicio">Servicio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IVA (%)
                    </label>
                    <input
                      type="number"
                      name="tax_rate"
                      value={formData.tax_rate}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
                >
                  {editingProduct ? 'Actualizar' : 'Crear Producto/Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
