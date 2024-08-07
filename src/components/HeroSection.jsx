import PropTypes from 'prop-types';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="container mx-auto mt-20 flex items-center justify-between px-6">
      <div className="flex-1">
        <div className="max-w-xl ml-auto">
          <h1 className="text-4xl font-bold mb-4">Always Track & Analyze Your Business Statistics To Succeed.</h1>
          <p className="text-lg mb-6">A better way to manage your sales, team, clients & marketing — on a single platform. Powerful, affordable & easy.</p>
          <div className="flex space-x-2">
            <TextField
              label="Enter your Devices"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Get started
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <img className="max-w-xl" src="/Asset 5.png" alt="Illustration" />
      </div>
    </div>
  );
};

HeroSection.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default HeroSection;
