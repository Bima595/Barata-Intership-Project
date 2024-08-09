import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path according to your file structure
import InputDataAdmin from '../components/InputDataAdmin'; // Adjust the path according to your file structure

const InputPage = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-16"> {/* Add margin to prevent the content from being hidden behind the navbar */}
        <InputDataAdmin />
      </div>
    </div>
  );
};

export default InputPage;
