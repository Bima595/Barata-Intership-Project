import { Box, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#f8f8f8', py: 4, mt: 5 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Office<br />Tech.
            </Typography>
          </Box>
          <Typography variant="body2" mt={2}>
            ngubalanDaring merupakan website yang membantu masyarakat Desa Ngubalan untuk mengurus administrasi di kantor desa tanpa harus datang langsung ketempat dan pengurusannya yang cepat.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            NAVIGASI
          </Typography>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={2}>
            Beranda
          </Link>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={1}>
            Tentang Kami
          </Link>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={1}>
            Pertanyaan Umum
          </Link>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            IKUTI KAMI
          </Typography>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={2}>
            Instagram
          </Link>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={1}>
            Tiktok
          </Link>
          <Link href="#" color="inherit" underline="none" variant="body2" display="block" mt={1}>
            X
          </Link>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            HUBUNGI KAMI
          </Typography>
          <Typography variant="body2" mt={2}>
            Jl. Raya Tlogomas No.246, Jawa Timur 65144, Indonesia
          </Typography>
          <Typography variant="body2" mt={1}>
            (62) 851 550 17757 (Quick Response)
          </Typography>
          <Typography variant="body2" mt={1}>
            doubleone@xyzscape.xyz
          </Typography>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <Typography variant="caption">
          © 2023 PT Barata Indonesia(Persero)™. All Rights Reserved.
        </Typography>
      </Box>
      <Box mt={1} textAlign="center">
        <Link href="#" color="inherit" mx={1}>
          <i className="fab fa-facebook"></i>
        </Link>
        <Link href="#" color="inherit" mx={1}>
          <i className="fab fa-twitter"></i>
        </Link>
        <Link href="#" color="inherit" mx={1}>
          <i className="fab fa-github"></i>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
