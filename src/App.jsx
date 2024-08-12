// App.jsx
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
          <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
          <Route path="/input" element={<PrivateRoute element={<InputPage />} />} />
          <Route path="/karyawan" element={<PrivateRoute element={<KaryawanPage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
