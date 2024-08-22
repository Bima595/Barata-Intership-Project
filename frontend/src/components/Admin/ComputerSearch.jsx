import React, { useState } from 'react';
import axios from 'axios';

const ComputerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');  // Menyimpan input dari pengguna
  const [result, setResult] = useState(null);        // Menyimpan hasil pencarian

  const handleSearch = async () => {
    console.log('Searching for:', searchTerm); // Log input searchTerm
    if (!searchTerm) {
      console.log('Search term is empty');
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/computers/${searchTerm}`);
      console.log('API Response:', response.data); // Log response dari API
      if (response.data.success) {
        setResult(response.data.data);  // Menyimpan data dari API
      } else {
        setResult(null);  // Reset hasil jika `success` adalah false
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResult(null);  // Reset hasil jika terjadi error
    }
  };

  return (
    <div>
      <h1>Search Computer by Nomor Aset</h1>
      <input
        type="text"
        placeholder="Enter Nomor Aset"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Mengubah nilai searchTerm saat input berubah
      />
      <button onClick={handleSearch}>Search</button>

      {result ? (
        <table>
          <thead>
            <tr>
              <th>ID Komputer</th>
              <th>Nomor Aset</th>
              <th>Jenis</th>
              <th>Nama</th>
              <th>OS</th>
              <th>Manufaktur</th>
              <th>Model</th>
              <th>Serial Number</th>
              <th>Garansi</th>
              <th>Status</th>
              <th>RAM</th>
              <th>Harddisk</th>
              <th>Prosesor</th>
              <th>Tahun Pembelian</th>
              <th>Nilai Pembelian</th>
              <th>MAC</th>
              <th>Foto</th>
              <th>Waktu Dibuat</th>
              <th>Waktu Diubah</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr key={result.id_komputer}>
              <td>{result.id_komputer}</td>
              <td>{result.nomor_aset}</td>
              <td>{result.jenis}</td>
              <td>{result.nama}</td>
              <td>{result.os}</td>
              <td>{result.manufaktur}</td>
              <td>{result.model}</td>
              <td>{result.serial_number}</td>
              <td>{new Date(result.garansi).toLocaleDateString()}</td>
              <td>{result.status}</td>
              <td>{result.ram} GB</td>
              <td>{result.harddisk} GB</td>
              <td>{result.prosesor}</td>
              <td>{new Date(result.thn_pembelian).toLocaleDateString()}</td>
              <td>{result.nilai_pembelian}</td>
              <td>{result.mac}</td>
              <td>
                {result.foto && <img src={result.foto} alt="Computer" width="100" />}
              </td>
              <td>{new Date(result.waktu_dibuat).toLocaleString()}</td>
              <td>{new Date(result.waktu_diubah).toLocaleString()}</td>
              <td>{result.deskripsi || 'No Description'}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No data found. Please try a different search term.</p>
      )}
    </div>
  );
};

export default ComputerSearch;
