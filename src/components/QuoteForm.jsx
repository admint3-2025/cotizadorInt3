import { useState, useEffect } from 'react';

export default function QuoteForm({ quote, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    client_company: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    validity_days: 15,
    delivery_time: '',
    payment_terms: '50% anticipo, 50% contra entrega',
    template_type: 2,
    notes: '',
    send_email: true
  });

  const [items, setItems] = useState([
    { code: '', description: '', specs: '', quantity: 1, unit_price: 0 }
  ]);

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(2);
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit_price: '',
    cost: '',
    stock: '',
    unit: 'PZA',
    is_service: false,
    tax_rate: 16
  });
  const [productError, setProductError] = useState('');

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowClientSuggestions(false);
      setShowProductSuggestions(false);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowClientSuggestions(false);
        setShowProductSuggestions(false);
        setActiveItemIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (quote) {
      setFormData({
        client_id: quote.client_id || '',
        client_name: quote.client_name,
        client_company: quote.client_company || '',
        client_email: quote.client_email,
        client_phone: quote.client_phone || '',
        client_address: quote.client_address || '',
        validity_days: quote.validity_days,
        delivery_time: quote.delivery_time || '',
        payment_terms: quote.payment_terms || '50% anticipo, 50% contra entrega',
        template_type: quote.template_type,
        notes: quote.notes || '',
        send_email: false
      });
      setItems(JSON.parse(quote.items));
      setClientSearchTerm(quote.client_name);
    }
  }, [quote]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products?active_only=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
    }
  };

  const handleClientSearch = (value) => {
    setClientSearchTerm(value);
    setFormData(prev => ({ ...prev, client_name: value, client_id: '' }));
    setShowClientSuggestions(value.length > 0);
  };

  const handleSelectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      client_id: client.id,
      client_name: client.name,
      client_company: client.company || '',
      client_email: client.email,
      client_phone: client.phone || '',
      client_address: client.address || ''
    }));
    setClientSearchTerm(client.name);
    setShowClientSuggestions(false);
  };

  const handleProductSearch = (value, index) => {
    setProductSearchTerm(value);
    setActiveItemIndex(index);
    handleItemChange(index, 'description', value);
    setShowProductSuggestions(value.length > 0);
  };

  const handleSelectProduct = (product, index) => {
    const newItems = [...items];
    newItems[index] = {
      code: product.code,
      description: product.name,
      specs: product.description || '',
      quantity: 1,
      unit_price: product.unit_price
    };
    setItems(newItems);
    setShowProductSuggestions(false);
    setActiveItemIndex(null);
    setProductSearchTerm('');
  };

  const handleCreateProduct = async () => {
    setProductError('');
    
    // Validaciones
    if (!newProduct.code || !newProduct.name || !newProduct.unit_price) {
      setProductError('Código, nombre y precio unitario son obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const createdProduct = await response.json();
        
        // Recargar productos
        await fetchProducts();
        
        // Seleccionar el producto recién creado en el item activo
        if (activeItemIndex !== null) {
          handleSelectProduct(createdProduct, activeItemIndex);
        }
        
        // Cerrar modal y limpiar form
        setShowNewProductModal(false);
        setNewProduct({
          code: '',
          name: '',
          description: '',
          category: '',
          unit_price: '',
          cost: '',
          stock: '',
          unit: 'PZA',
          is_service: false,
          tax_rate: 16
        });
        
        alert('✅ Producto creado exitosamente');
      } else {
        const data = await response.json();
        setProductError(data.error || 'Error al crear producto');
      }
    } catch (err) {
      setProductError('Error de conexión con el servidor');
    }
  };

  const filteredProducts = products.filter(p =>
    p.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(productSearchTerm.toLowerCase()))
  ).slice(0, 8);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
    c.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
  ).slice(0, 5);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'client_name') {
      handleClientSearch(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    
    // Si cambian descripción manualmente, cerrar sugerencias
    if (field === 'description' && activeItemIndex === index) {
      setShowProductSuggestions(false);
    }
  };

  const addItem = () => {
    setItems([...items, { code: '', description: '', specs: '', quantity: 1, unit_price: 0 }]);
    setShowProductSuggestions(false);
    setActiveItemIndex(null);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      if (activeItemIndex === index) {
        setShowProductSuggestions(false);
        setActiveItemIndex(null);
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.unit_price || 0));
    }, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          tax,
          total
        })
      });

      if (response.ok) {
        alert('✅ Cotización creada exitosamente\n\n💡 Descarga el PDF desde la lista de cotizaciones');
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Error al crear cotización');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const templateDescriptions = {
    1: '📄 Ejecutivo Minimalista - Simple, limpio y profesional',
    2: '📋 Detallado Profesional - Completo con especificaciones técnicas (Recomendado)',
    3: '🎨 Moderno Visual - Diseño atractivo con gradientes y gráficas'
  };

  return (
    <div className="animate-slide-in">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {quote ? 'Editar Cotización' : 'Nueva Cotización'}
            </h2>
            <p className="text-gray-600">Complete los datos para generar la cotización</p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            ← Volver
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Datos del Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👤</span> Información del Cliente
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => setShowClientSuggestions(clientSearchTerm.length > 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe para buscar cliente existente..."
                required
              />
              
              {/* Sugerencias de clientes */}
              {showClientSuggestions && filteredClients.length > 0 && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                >
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">{client.name}</div>
                      {client.company && (
                        <div className="text-sm text-gray-600">{client.company}</div>
                      )}
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="client_company"
                value={formData.client_company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="client_address"
                value={formData.client_address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Productos/Servicios */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">📦</span> Productos / Servicios
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              ➕ Agregar Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                    title="Eliminar item"
                  >
                    ✕
                  </button>
                )}

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Código/SKU
                    </label>
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="SKU123"
                    />
                  </div>

                  <div className="col-span-4 relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Descripción * 
                      <span className="ml-2 text-blue-600 font-normal">🔍 Busca por nombre, código o descripción</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={item.description}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => {
                          setActiveItemIndex(index);
                          setProductSearchTerm(item.description || '');
                          setShowProductSuggestions(true);
                        }}
                        onChange={(e) => {
                          handleProductSearch(e.target.value, index);
                        }}
                        className="w-full pl-9 pr-24 py-2 border-2 border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="🔍 Buscar producto o servicio..."
                        required
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItemIndex(index);
                          setProductSearchTerm(item.description || '');
                          setShowProductSuggestions(true);
                        }}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center"
                      >
                        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100">
                          📦 Catálogo
                        </span>
                      </button>
                    </div>
                    {showProductSuggestions && activeItemIndex === index && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute z-20 w-full mt-1 bg-white border-2 border-blue-400 rounded-lg shadow-2xl max-h-72 overflow-y-auto"
                      >
                        {filteredProducts.length > 0 ? (
                          <>
                            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-xs font-semibold flex justify-between items-center">
                              <span>📦 {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowNewProductModal(true);
                                }}
                                className="px-2 py-1 bg-white text-blue-600 rounded hover:bg-blue-50 font-semibold text-xs"
                              >
                                ➕ Crear Nuevo
                              </button>
                            </div>
                            {filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product, index)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                      {product.is_service ? '🔧' : '📦'} {product.name}
                                    </div>
                                    {product.code && (
                                      <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">
                                        SKU: {product.code}
                                      </div>
                                    )}
                                    {product.description && (
                                      <div className="text-xs text-gray-600 mt-1">{product.description}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-base font-bold text-blue-600">
                                      {formatCurrency(product.unit_price)}
                                    </div>
                                    {!product.is_service && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        Stock: <span className="font-semibold">{product.stock}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <div className="text-3xl mb-2">🔍</div>
                            <div className="text-sm font-medium">No se encontraron productos</div>
                            <div className="text-xs mt-1">
                              {productSearchTerm ? `Intenta con otra búsqueda` : 'Comienza a escribir para buscar'}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowNewProductModal(true);
                              }}
                              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
                            >
                              ➕ Crear Nuevo Producto
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Especificaciones
                    </label>
                    <input
                      type="text"
                      value={item.specs}
                      onChange={(e) => handleItemChange(index, 'specs', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Detalles técnicos"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cant.
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      P. Unitario
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span className="text-sm text-gray-600">Subtotal: </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IVA (16%):</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-blue-600 pt-2 border-t-2 border-blue-200">
                <span>TOTAL:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Configuración de la Cotización
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vigencia (días)
              </label>
              <input
                type="number"
                name="validity_days"
                min="1"
                value={formData.validity_days}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de entrega
              </label>
              <input
                type="text"
                name="delivery_time"
                value={formData.delivery_time}
                onChange={handleInputChange}
                placeholder="Ej: 5-7 días hábiles"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de pago
              </label>
              <input
                type="text"
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas / Observaciones
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Información adicional importante..."
              ></textarea>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="send_email"
                checked={formData.send_email}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                📧 Enviar automáticamente por correo al cliente
              </span>
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Procesando...' : (quote ? 'Actualizar Cotización' : 'Crear y Guardar Cotización')}
          </button>
        </div>
      </form>

      {/* Modal de Crear Producto */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">➕ Crear Nuevo Producto/Servicio</h3>
                <button
                  onClick={() => {
                    setShowNewProductModal(false);
                    setProductError('');
                  }}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {productError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ⚠️ {productError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código/SKU *
                  </label>
                  <input
                    type="text"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU123"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Debe ser único</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Electrónica, Servicios"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad
                  </label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PZA">PZA - Pieza</option>
                    <option value="KG">KG - Kilogramo</option>
                    <option value="M">M - Metro</option>
                    <option value="L">L - Litro</option>
                    <option value="HR">HR - Hora</option>
                    <option value="SRV">SRV - Servicio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Unitario *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.unit_price}
                    onChange={(e) => setNewProduct({ ...newProduct, unit_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    disabled={newProduct.is_service}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IVA (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={newProduct.tax_rate}
                    onChange={(e) => setNewProduct({ ...newProduct, tax_rate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="16"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.is_service}
                      onChange={(e) => setNewProduct({ 
                        ...newProduct, 
                        is_service: e.target.checked,
                        stock: e.target.checked ? 0 : newProduct.stock
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🔧 Es un servicio (no requiere inventario)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProductModal(false);
                    setProductError('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  ✅ Crear Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
