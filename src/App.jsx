import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QuoteForm from './components/QuoteForm';
import QuoteList from './components/QuoteList';
import UserManagement from './components/UserManagement';
import ClientManagement from './components/ClientManagement';
import ProductManagement from './components/ProductManagement';
import ImportData from './components/ImportData';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleNewQuote = () => {
    setSelectedQuote(null);
    setCurrentView('form');
  };

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setSelectedQuote(null);
    setCurrentView('list');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        currentView={currentView}
        onNewQuote={handleNewQuote}
        onViewList={() => setCurrentView('list')}
        onViewUsers={() => setCurrentView('users')}
        onViewClients={() => setCurrentView('clients')}
        onViewProducts={() => setCurrentView('products')}
        onViewImport={() => setCurrentView('import')}
      >
        {currentView === 'form' ? (
          <QuoteForm 
            quote={selectedQuote}
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        ) : currentView === 'users' ? (
          <UserManagement />
        ) : currentView === 'clients' ? (
          <ClientManagement />
        ) : currentView === 'products' ? (
          <ProductManagement />
        ) : currentView === 'import' ? (
          <ImportData />
        ) : (
          <QuoteList 
            onNewQuote={handleNewQuote}
            onEditQuote={handleEditQuote}
          />
        )}
      </Dashboard>
    </div>
  );
}

export default App;
