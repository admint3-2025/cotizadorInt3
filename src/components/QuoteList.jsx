import { useState, useEffect } from 'react';

export default function QuoteList({ onNewQuote, onEditQuote }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAudit, setShowAudit] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quotes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      } else {
        setError('Error al cargar cotizaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quotes/audit/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuditHistory(data);
        setShowAudit(true);
      }
    } catch (err) {
      alert('Error al cargar historial de auditoría');
    }
  };

  const handleDownloadPDF = async (quote) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quotes/${quote.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar PDF');
      }

      const blob = await response.blob();
      
      // Verificar que el blob sea válido
      if (blob.size === 0) {
        throw new Error('El PDF está vacío');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quote.folio}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Limpiar después de un pequeño delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      console.error('Error al descargar PDF:', err);
      alert('Error al descargar PDF: ' + err.message);
    }
  };

  const handleResend = async (quote) => {
    if (!confirm(`¿Enviar cotización ${quote.folio} a ${quote.client_email}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Cotización enviada correctamente');
        fetchQuotes();
      } else {
        const data = await response.json();
        alert('⚠️ ' + (data.error || 'No se pudo enviar el email') + '\n\n💡 Descarga el PDF y envíalo manualmente desde tu cliente de correo.');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleDeleteClick = (quote) => {
    setQuoteToDelete(quote);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReason.trim()) {
      alert('Por favor proporciona una razón para la eliminación');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quotes/${quoteToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: deleteReason })
      });

      if (response.ok) {
        alert('✅ Cotización eliminada y registrada en auditoría');
        setShowDeleteModal(false);
        setQuoteToDelete(null);
        setDeleteReason('');
        fetchQuotes();
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo eliminar'));
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const filteredQuotes = quotes.filter(q =>
    q.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.client_company && q.client_company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <h2 className="text-2xl font-bold text-gray-800">Cotizaciones</h2>
            <p className="text-gray-600">Total: {quotes.length} cotizaciones</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAuditHistory}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition transform hover:scale-105 shadow-lg"
            >
              📋 Ver Auditoría
            </button>
            <button
              onClick={onNewQuote}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 shadow-lg"
            >
              ➕ Nueva Cotización
            </button>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por folio, cliente o empresa..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Lista de cotizaciones */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No se encontraron cotizaciones' : 'No hay cotizaciones aún'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera cotización para comenzar'}
          </p>
          {!searchTerm && (
            <button
              onClick={onNewQuote}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Crear Cotización
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      {quote.folio}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quote.sent_at 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.sent_at ? '✓ Enviada' : '⏳ Pendiente'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Cliente</p>
                      <p className="font-semibold text-gray-800">{quote.client_name}</p>
                      {quote.client_company && (
                        <p className="text-sm text-gray-600">{quote.client_company}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contacto</p>
                      <p className="text-sm text-gray-700">{quote.client_email}</p>
                      {quote.client_phone && (
                        <p className="text-sm text-gray-600">{quote.client_phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>📅 {formatDate(quote.created_at)}</span>
                    {quote.created_by_name && (
                      <span>👤 {quote.created_by_name}</span>
                    )}
                    <span>⏱️ Vigencia: {quote.validity_days} días</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {formatCurrency(quote.total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleDownloadPDF(quote)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center space-x-2"
                    title="Descargar PDF"
                  >
                    <span>📥</span>
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleResend(quote)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center space-x-2"
                    title="Enviar por email"
                  >
                    <span>📧</span>
                    <span>Enviar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(quote)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center space-x-2"
                    title="Eliminar cotización"
                  >
                    <span>🗑️</span>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ⚠️ Eliminar Cotización
            </h3>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de eliminar la cotización <strong>{quoteToDelete?.folio}</strong>?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Esta acción se registrará en el historial de auditoría.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón de eliminación *
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Ej: Cotización duplicada, cliente canceló, error en montos..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setQuoteToDelete(null);
                  setDeleteReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Auditoría */}
      {showAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl w-full mx-4 my-8 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                📋 Historial de Auditoría - Cotizaciones Eliminadas
              </h3>
              <button
                onClick={() => setShowAudit(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {auditHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600">No hay registros de auditoría</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditHistory.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-500"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Folio</p>
                        <p className="font-bold text-gray-800">{record.folio}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-medium text-gray-800">{record.client_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monto Total</p>
                        <p className="font-bold text-blue-600">{formatCurrency(record.total)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Creado por</p>
                        <p className="text-gray-700">{record.created_by_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(record.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Eliminado por</p>
                        <p className="text-gray-700">{record.deleted_by_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(record.deleted_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Razón de eliminación</p>
                        <p className="text-gray-700 italic">{record.deletion_reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
