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

function App() {
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
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
