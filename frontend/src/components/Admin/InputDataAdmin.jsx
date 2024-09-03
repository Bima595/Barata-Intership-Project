import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageIcon from '@mui/icons-material/Image';

const DeviceInputForm = () => {
  const [formData, setFormData] = useState({
    nomor_aset: '',
    jenis: '',
    nama: '',
    os: '',
    manufaktur: '',
    model: '',
    serial_number: '',
    garansi: '',
    status: '',
    ram: '',
    harddisk: '',
    thn_pembelian: '',
    nilai_pembelian: '',
    deskripsi: '',
  });

  const [foto, setFoto] = useState([]);
  const [preview, setPreview] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length + foto.length > 2) {
      alert('Anda hanya bisa mengunggah maksimal 2 foto.');
      return;
    }
  
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFoto((prevFiles) => [...prevFiles, ...files]);
    setPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithFiles = new FormData();
    for (let key in formData) {
      formDataWithFiles.append(key, formData[key]);
    }

    foto.forEach((file) => {
      formDataWithFiles.append('foto', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/komputer', formDataWithFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form Data Submitted:', response.data);

      if (response.data.success) {
        alert('Data perangkat berhasil disimpan!');
        navigate('/Karyawan');
      } else {
        alert('Gagal menyimpan data perangkat: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan data perangkat.');
    }
  };

  return (
    <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-center">Form Input Perangkat</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Input Nomor Aset */}
        <div className="mb-4">
          <label className="block text-gray-700">Nomor Aset</label>
          <input
            type="text"
            name="nomor_aset"
            value={formData.nomor_aset}
            onChange={handleChange}
            placeholder="Isi Nomor Aset"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Input Jenis */}
        <div className="mb-4">
          <label className="block text-gray-700">Jenis</label>
          <input
            type="text"
            name="jenis"
            value={formData.jenis}
            onChange={handleChange}
            placeholder="Isi Jenis"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Input Nama */}
        <div className="mb-4">
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Isi Nama Perangkat"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Input OS */}
        <div className="mb-4">
          <label className="block text-gray-700">Windows</label>
          <input
            type="text"
            name="os"
            value={formData.os}
            onChange={handleChange}
            placeholder="Isi OS"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Input Manufaktur */}
        <div className="mb-4">
          <label className="block text-gray-700">Manufaktur (Nama Model)</label>
          <input
            type="text"
            name="manufaktur"
            value={formData.manufaktur}
            onChange={handleChange}
            placeholder="Isi Manufaktur"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Input Model */}
        <div className="mb-4">
          <label className="block text-gray-700">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Isi Model"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>


        {/* Input RAM */}
        <div className="mb-4">
          <label className="block text-gray-700">RAM</label>
          <input
            type="number"
            name="ram"
            value={formData.ram}
            onChange={handleChange}
            placeholder="Ukuran RAM (dalam GB)"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Input Harddisk */}
        <div className="mb-4">
          <label className="block text-gray-700">Harddisk</label>
          <input
            type="number"
            name="harddisk"
            value={formData.harddisk}
            onChange={handleChange}
            placeholder="Ukuran Harddisk (dalam GB)"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Input Tahun Pembelian */}
        <div className="mb-4">
          <label className="block text-gray-700">Tahun Pembelian</label>
          <input
            type="date"
            name="thn_pembelian"
            value={formData.thn_pembelian}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Input Garansi */}
        <div className="mb-4">
          <label className="block text-gray-700">Garansi</label>
          <input
            type="date"
            name="garansi"
            value={formData.garansi}
            onChange={handleChange}
            placeholder="Tanggal Garansi"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Input Nilai Pembelian */}
        <div className="mb-4">
          <label className="block text-gray-700">Nilai Pembelian</label>
          <input
            type="text"
            name="nilai_pembelian"
            value={formData.nilai_pembelian}
            onChange={handleChange}
            placeholder="Nilai Pembelian"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Input Deskripsi */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Deskripsi (Opsional)</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi tambahan"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Upload Foto */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Upload Foto (Maksimal 2 foto)</label>
          <div className="flex items-center justify-center">
            <label htmlFor="file-input" className="cursor-pointer">
              <ImageIcon style={{ fontSize: 60, color: 'gray' }} />
            </label>
            <input
              id="file-input"
              type="file"
              name="foto"
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
              required
            />
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            {preview.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-48 h-48 object-cover border border-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700">Submit</button>
      </div>
    </form>
  );
};

export default DeviceInputForm;
