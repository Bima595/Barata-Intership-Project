// src/FormComponent.js
import { useState } from 'react';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    npk: '',
    nama: '',
    jabatan: '',
    satuanOrganisasi: '',
    kondisiPerangkat: '',
    keterangan: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add your database insertion logic here
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-center">Silahkan mengisi Form dibawah</h2>
      <div className="mb-4">
        <label className="block text-gray-700">NPK (Nomor Pokok Kepegawaian)</label>
        <input
          type="text"
          name="npk"
          value={formData.npk}
          onChange={handleChange}
          placeholder="Isi NPK"
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Isi Nama"
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Jabatan</label>
        <input
          type="text"
          name="jabatan"
          value={formData.jabatan}
          onChange={handleChange}
          placeholder="Isi Jabatan"
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Satuan Organisasi</label>
        <input
          type="text"
          name="satuanOrganisasi"
          value={formData.satuanOrganisasi}
          onChange={handleChange}
          placeholder="Isi Satuan Organisasi"
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Kondisi Perangkat</label>
        <select
          name="kondisiPerangkat"
          value={formData.kondisiPerangkat}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="">Kondisi Perangkat</option>
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
          <option value="Hilang">Hilang</option>
          <option value="Perbaikan">Perbaikan</option>
          <option value="Tidak Terpakai">TIdak Terpakai</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Keterangan (Opsional)</label>
        <input
          type="text"
          name="keterangan"
          value={formData.keterangan}
          onChange={handleChange}
          placeholder="Keterangan"
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="text-center">
        <button type="submit" className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700">Submit</button>
      </div>
    </form>
  );
};

export default FormComponent;
