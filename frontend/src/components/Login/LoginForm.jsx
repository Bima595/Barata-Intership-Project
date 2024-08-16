import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LoginForm = () => {
  const [userType, setUserType] = useState('Karyawan');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    employeeId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setError('');
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        userType,
        username: formData.username,
        password: formData.password,
        employeeId: formData.employeeId,
      });

      if (response.data.success) {
        login({ role: response.data.role });
        if (response.data.role === 'Admin') {
          navigate('/admin');
        } else if (response.data.role === 'Karyawan') {
          navigate('/karyawan');
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormControl fullWidth variant="outlined">
        <InputLabel>User type</InputLabel>
        <Select
          value={userType}
          onChange={handleUserTypeChange}
          label="User type"
        >
          <MenuItem value="Karyawan">Karyawan</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </Select>
      </FormControl>
      {userType === 'Admin' ? (
        <>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </>
      ) : (
        <TextField
          label="Karyawan ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="bg-blue-500 text-white mt-4"
      >
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;