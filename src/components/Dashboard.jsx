export default function Dashboard({ user, onLogout, currentView, onNewQuote, onViewList, onViewUsers, onViewClients, onViewProducts, onViewImport, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Profesional */}
      <header className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://integrational3.com.mx/logorigen/integrational_std2.png" 
                    alt="Integrational Logo" 
                    className="h-10"
                  />
                </div>
                <div className="border-l-2 border-gray-300 pl-3">
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">Sistema de Cotizaciones</h1>
                  <p className="text-xs text-gray-500 font-medium">Gestión Empresarial</p>
                </div>
              </div>
            </div>

            {/* User info y logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right border-r border-gray-300 pr-4">
                <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 shadow-md font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Profesional */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex space-x-2">
            <button
              onClick={onViewList}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'list'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Cotizaciones</span>
            </button>
            <button
              onClick={onNewQuote}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'form'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva Cotización</span>
            </button>
            <button
              onClick={onViewUsers}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'users'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Usuarios</span>
            </button>
            <button
              onClick={onViewClients}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'clients'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Clientes</span>
            </button>
            <button
              onClick={onViewProducts}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'products'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Productos</span>
            </button>
            <button
              onClick={onViewImport}
              className={`px-6 py-3.5 font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'import'
                  ? 'bg-white text-blue-600 rounded-t-lg shadow-lg'
                  : 'text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Importar Datos</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
