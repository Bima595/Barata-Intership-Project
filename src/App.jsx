import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import InputPage from './pages/InputPage'
import KaryawanPage from './pages/KaryawanPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/input' element={<InputPage />} />
        <Route path="/karyawan" element={<KaryawanPage />} />
      </Routes>
    </Router>
  );
};

export default App;
