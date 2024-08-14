import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const EmployeeDetails = ({ employee }) => {
  return (
    <Box mt={3}>
      <Typography variant="h6" component="div">
        Pemakai Saat Ini
      </Typography>
      <Typography variant="body1" component="div">
        <strong>Nama:</strong> {employee.nama}
      </Typography>
      <Typography variant="body1" component="div">
        <strong>NIP:</strong> {employee.nip}
      </Typography>
      <Typography variant="body1" component="div">
        <strong>Tanggal Pinjam:</strong> {employee.tanggal_pinjam.toDateString()}
      </Typography>
    </Box>
  );
};

EmployeeDetails.propTypes = {
  employee: PropTypes.shape({
    nama: PropTypes.string.isRequired,
    nip: PropTypes.string.isRequired,
    tanggal_pinjam: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

export default EmployeeDetails;
