import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

const DeviceDetails = ({ device }) => {
  const {
    nomor_aset,
    jenis,
    nama,
    os,
    manufaktur,
    model,
    serial_number,
    garansi,
    status,
    ram,
    harddisk,
    prosesor,
    thn_pembelian,
    nilai_pembelian,
    mac,
    foto,
    pemakai,
  } = device;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={5} p={3}>
      <Box display="flex" alignItems="center">
        <Box position="relative" display="flex" alignItems="center" mr={5}>
          <img src={foto} alt="Device" style={{ maxWidth: '400px', marginRight: '20px' }} />
          
          {/* Curly bracket line */}
          <Box
            position="absolute"
            left="50%"
            top="0"
            height="100%"
            width="1px"
            bgcolor="grey.300"
            style={{ transform: 'translateX(-10%)' }}
          >
            <Box
              position="absolute"
              left="50%"
              top="30px"
              width="0"
              height="0"
              borderLeft="15px solid transparent"
              borderRight="15px solid transparent"
              borderBottom="15px solid grey.300"
              style={{ transform: 'translateX(-10%)' }}
            />
            <Box
              position="absolute"
              left="50%"
              bottom="30px"
              width="0"
              height="0"
              borderLeft="15px solid transparent"
              borderRight="15px solid transparent"
              borderTop="15px solid grey.300"
              style={{ transform: 'translateX(-10%)' }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            {nama}
          </Typography>
          <Box mt={3}>
            {/* Manually customize spacing here */}
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Nomor Aset: {nomor_aset}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Jenis: {jenis}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Nama: {nama}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                OS: {os}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Manufaktur: {manufaktur}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Model: {model}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Serial Number: {serial_number}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Garansi: {garansi.toDateString()}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Status: {status}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                RAM: {ram} GB
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Harddisk: {harddisk} GB
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Prosesor: {prosesor}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Tahun Pembelian: {thn_pembelian.toDateString()}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                Nilai Pembelian: {nilai_pembelian}
              </Button>
            </Box>
            <Box mb={3}>
              <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                MAC: {mac}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={5} style={{ fontFamily: 'Plus Jakarta Sans' }}>
        <Typography variant="h6" component="div" gutterBottom class='font-semibold'>
          Pemakai Saat Ini
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {pemakai.nama}
        </Typography>
        <Typography variant="body2" color="textSecondary" class='font-bold'>
          {pemakai.nip}
        </Typography>
        <Typography variant="body2" color="textSecondary" class='font-light'>
          {pemakai.tanggal_pinjam.toDateString()} - Sekarang
        </Typography>
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
    foto: PropTypes.string.isRequired,
    pemakai: PropTypes.shape({
      nama: PropTypes.string.isRequired,
      nip: PropTypes.string.isRequired,
      tanggal_pinjam: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};

export default DeviceDetails;
