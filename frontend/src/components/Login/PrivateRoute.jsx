// /component/login/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element, requiredRole }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    // User is not logged in, redirect to login page
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (auth.role !== requiredRole) {
    // User does not have the correct role, redirect to their appropriate page
    if (auth.role === 'Admin') {
      return <Navigate to="/admin" />;
    } else if (auth.role === 'Karyawan') {
      return <Navigate to="/karyawan" />;
    } else {
      // If role doesn't match any known role, redirect to login
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and has the correct role, render the element
  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

export default PrivateRoute;
