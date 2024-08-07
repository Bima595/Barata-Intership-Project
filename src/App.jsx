import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';  // Sesuaikan path ini sesuai dengan struktur folder Anda


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
