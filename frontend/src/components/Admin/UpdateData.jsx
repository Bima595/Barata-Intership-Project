import { useState } from 'react';
import UpdateComputers from './UpdateComponent/UpdateComputers'; 
import Pinjam from './UpdateComponent/Pinjam'; 
import Pengembalian from './UpdateComponent/Pengembalian'; 
import UpdateKaryawan from './UpdateComponent/UpdateKaryawan';

const UpdateData = () => {
  const [visibleDialog, setVisibleDialog] = useState('');

  const handleUpdate = (type) => {
    setVisibleDialog(type);
  };

  const closeDialog = () => {
    setVisibleDialog('');
  };

  return (
    <div className="flex items-center justify-center p-2 mb-20">
      <div className="bg-white p-2 rounded-lg w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Update Data</h1>

        <div className="grid grid-cols-2 gap-6 md:gap-4">
          <button
            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => handleUpdate('Komputer')}
          >
            Update Komputer
          </button>
          <button
            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => handleUpdate('Karyawan')}
          >
            Update Karyawan
          </button>
          <button
            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => handleUpdate('Pinjam')}
          >
            Pinjam Aset
          </button>
          <button
            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => handleUpdate('Pengembalian')}
          >
            Pengembalian Aset
          </button>
        </div>
      </div>

      <UpdateComputers
        open={visibleDialog === 'Komputer'}
        handleClose={closeDialog}
      />
      <UpdateKaryawan
        open={visibleDialog === 'Karyawan'}
        handleClose={closeDialog}
      />
      <Pinjam
        open={visibleDialog === 'Pinjam'}
        handleClose={closeDialog}
      />
      <Pengembalian
        open={visibleDialog === 'Pengembalian'}
        handleClose={closeDialog}
      />

    </div>
  );
};

export default UpdateData;
