import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import InputPage from './pages/InputPage';
import KaryawanPage from './pages/KaryawanPage';
import { AuthProvider } from './components/Login/AuthContext';
import PrivateRoute from './components/Login/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<PrivateRoute element={<AdminPage />} requiredRole="Admin" />} />
          <Route path="/input" element={<PrivateRoute element={<InputPage />} requiredRole="Karyawan" />} />
          <Route path="/karyawan" element={<PrivateRoute element={<KaryawanPage />} requiredRole="Karyawan" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
