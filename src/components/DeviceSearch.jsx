import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

const DeviceDetails = ({ device }) => {
  const { deviceName, details } = device;

  return (
    <Box display="flex" alignItems="center" mb={5} p={3}>
      <img src="/public/LaptopBlack.png" alt="Device" style={{ maxWidth: '800px', marginRight: '20px' }} />
      <Box position="relative" ml={5}>
        <Typography variant="h6" component="div" gutterBottom>
          {deviceName}
        </Typography>
        <Box position="absolute" left="100%" top="50%" height="1px" width="50px" bgcolor="grey.300"></Box>
        <Box mt={3}>
          {Object.keys(details).map((key, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2} position="relative">
              <Box position="absolute" left="-25px" width="1px" height="20px" bgcolor="grey.300"></Box>
              <Box position="absolute" left="-25px" bottom="50%" width="25px" height="1px" bgcolor="Black"></Box>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color:'black' }}>
                {key}: {details[key]}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

DeviceDetails.propTypes = {
  device: PropTypes.shape({
    deviceName: PropTypes.string.isRequired,
    details: PropTypes.objectOf(PropTypes.string).isRequired
  }).isRequired
};

export default DeviceDetails;
