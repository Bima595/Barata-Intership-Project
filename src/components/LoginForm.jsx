import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, FormControl, InputLabel, Select, TextField, Button } from '@mui/material';

const LoginForm = () => {
  const [userType, setUserType] = useState('Karyawan');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    employeeId: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userType === 'Admin') {
      if (formData.username === 'admin' && formData.password === 'barata46') {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const validEmployeeIds = ['123', '456', '789']; 
      if (validEmployeeIds.includes(formData.employeeId)) {
        navigate('/Karyawan');
      } else {
        setError('Invalid employee ID');
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
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
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
      <Button type="submit" variant="contained" color="primary" className="bg-blue-500 text-white mt-4">
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
