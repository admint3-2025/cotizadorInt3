import { useState } from 'react';
import { Upload, Download, FileText, Users, Package, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ImportData() {
  const [importType, setImportType] = useState('clients');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/import/${importType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFile(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      } else {
        alert(data.error || 'Error al importar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al importar archivo');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/api/import/template/${importType}`;
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_${importType === 'clients' ? 'clientes' : 'productos'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al descargar plantilla');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Importar Datos</h1>

      {/* Selector de tipo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Selecciona qué deseas importar</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setImportType('clients');
              setFile(null);
              setResult(null);
            }}
            className={`p-6 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
              importType === 'clients'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Users className="w-12 h-12" />
            <span className="font-semibold">Clientes</span>
          </button>

          <button
            onClick={() => {
              setImportType('products');
              setFile(null);
              setResult(null);
            }}
            className={`p-6 border-2 rounded-lg flex flex-col items-center gap-3 transition-all ${
              importType === 'products'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Package className="w-12 h-12" />
            <span className="font-semibold">Productos/Servicios</span>
          </button>
        </div>
      </div>

      {/* Descargar plantilla */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Paso 1: Descarga la plantilla CSV
            </h3>
            <p className="text-blue-700 mb-4">
              Descarga la plantilla de ejemplo para {importType === 'clients' ? 'clientes' : 'productos/servicios'} 
              y llénala con tus datos.
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Descargar Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Subir archivo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Paso 2: Selecciona tu archivo CSV
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition"
          >
            Seleccionar Archivo CSV
          </label>
          
          {file && (
            <div className="mt-4 text-sm text-gray-600">
              Archivo seleccionado: <span className="font-semibold">{file.name}</span>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleImport}
            disabled={loading}
            className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Importando...' : 'Importar Datos'}
          </button>
        )}
      </div>

      {/* Resultado */}
      {result && (
        <div className={`rounded-lg p-6 ${
          result.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start gap-4">
            {result.failed === 0 ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${
                result.failed === 0 ? 'text-green-900' : 'text-yellow-900'
              }`}>
                Importación Completada
              </h3>
              <div className="space-y-1 text-sm">
                <p><strong>Total de registros:</strong> {result.total}</p>
                <p className="text-green-700"><strong>Importados exitosamente:</strong> {result.imported}</p>
                {result.failed > 0 && (
                  <p className="text-red-700"><strong>Fallidos:</strong> {result.failed}</p>
                )}
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-red-700 mb-2">Errores encontrados:</p>
                  <div className="bg-white rounded border border-red-200 max-h-60 overflow-y-auto p-3">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-xs mb-2 pb-2 border-b border-gray-200 last:border-0">
                        <p className="text-red-600 font-semibold">Línea {error.line}: {error.error}</p>
                        <p className="text-gray-600 mt-1">Datos: {JSON.stringify(error.data)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Formato del archivo CSV</h3>
        <div className="text-sm text-gray-700 space-y-2">
          {importType === 'clients' ? (
            <>
              <p><strong>Columnas requeridas:</strong> name, email</p>
              <p><strong>Columnas opcionales:</strong> company, phone, address, rfc, payment_terms, notes</p>
            </>
          ) : (
            <>
              <p><strong>Columnas requeridas:</strong> code, name, unit_price</p>
              <p><strong>Columnas opcionales:</strong> description, specs, category, stock, is_active</p>
            </>
          )}
          <p className="mt-3 text-gray-600">
            💡 Asegúrate de que tu archivo esté codificado en UTF-8 para evitar problemas con caracteres especiales.
          </p>
        </div>
      </div>
    </div>
  );
}
