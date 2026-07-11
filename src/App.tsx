import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/Dashboard';
import { PocketCoach } from './pages/PocketCoach';
import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');

  useEffect(() => {
    const handleToggle = () => {
      setTempApiKey(localStorage.getItem('GEMINI_API_KEY') || '');
      setShowSettings(prev => !prev);
    };
    window.addEventListener('toggle-settings', handleToggle);
    return () => window.removeEventListener('toggle-settings', handleToggle);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="coach"
                  element={
                    <ProtectedRoute>
                      <PocketCoach />
                    </ProtectedRoute>
                  }
                />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>

          {/* Global Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl max-w-md w-full space-y-4 font-sans text-sm shadow-xl transition-all">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-500" />
                  System Settings
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">GEMINI_API_KEY</label>
                  <input 
                    type="password" 
                    placeholder="Enter Gemini API key..." 
                    value={tempApiKey} 
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  />
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Stored securely in your local browser storage. Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google AI Studio</a> to unlock your pocket AI Coach.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('GEMINI_API_KEY');
                      setTempApiKey('');
                      setShowSettings(false);
                      window.location.reload();
                    }} 
                    className="px-3.5 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    Clear Key
                  </button>
                  <button 
                    onClick={() => {
                      if (tempApiKey.trim()) {
                        localStorage.setItem('GEMINI_API_KEY', tempApiKey.trim());
                      } else {
                        localStorage.removeItem('GEMINI_API_KEY');
                      }
                      setShowSettings(false);
                      window.location.reload();
                    }} 
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-lg shadow transition-colors"
                  >
                    Save & Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
