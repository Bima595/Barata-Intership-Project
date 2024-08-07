import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

const DeviceDetails = ({ device }) => {
  const { nomor_aset, jenis, nama, os, manufaktur, model, serial_number, garansi, status, ram, harddisk, prosesor, thn_pembelian, nilai_pembelian, mac, foto } = device;

  return (
    <Box display="flex" alignItems="center" mb={5} p={3}>
      <img src={foto} alt="Device" style={{ maxWidth: '800px', marginRight: '20px' }} />
      <Box position="relative" ml={5}>
        <Typography variant="h6" component="div" gutterBottom>
          {nama}
        </Typography>
        <Box position="absolute" left="100%" top="50%" height="1px" width="50px" bgcolor="grey.300"></Box>
        <Box mt={3}>
          {[
            { label: 'Nomor Aset', value: nomor_aset },
            { label: 'Jenis', value: jenis },
            { label: 'Nama', value: nama },
            { label: 'OS', value: os },
            { label: 'Manufaktur', value: manufaktur },
            { label: 'Model', value: model },
            { label: 'Serial Number', value: serial_number },
            { label: 'Garansi', value: garansi.toDateString() },
            { label: 'Status', value: status },
            { label: 'RAM', value: `${ram} GB` },
            { label: 'Harddisk', value: `${harddisk} GB` },
            { label: 'Prosesor', value: prosesor },
            { label: 'Tahun Pembelian', value: thn_pembelian.toDateString() },
            { label: 'Nilai Pembelian', value: nilai_pembelian },
            { label: 'MAC', value: mac },
          ].map((detail, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2} position="relative">
              <Box position="absolute" left="-25px" width="1px" height="20px" bgcolor="grey.300"></Box>
              <Box position="absolute" left="-25px" bottom="50%" width="25px" height="1px" bgcolor="Black"></Box>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                {detail.label}: {detail.value}
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
    nomor_aset: PropTypes.string.isRequired,
    jenis: PropTypes.string.isRequired,
    nama: PropTypes.string.isRequired,
    os: PropTypes.string.isRequired,
    manufaktur: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    serial_number: PropTypes.string.isRequired,
    garansi: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.string.isRequired,
    ram: PropTypes.number.isRequired,
    harddisk: PropTypes.number.isRequired,
    prosesor: PropTypes.string.isRequired,
    thn_pembelian: PropTypes.instanceOf(Date).isRequired,
    nilai_pembelian: PropTypes.string.isRequired,
    mac: PropTypes.string.isRequired,
    foto: PropTypes.string.isRequired
  }).isRequired
};

export default DeviceDetails;
