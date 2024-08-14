import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
