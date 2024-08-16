import { useState, useEffect } from 'react';
import axios from 'axios';

const DeviceKantor = () => {
  const [data, setData] = useState([]);
  const [peminjamFilter, setPeminjamFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/devicekantor')
      .then(response => {
        const fetchedData = response.data.data.map(item => ({
          id: item.id, // assuming you have an ID for the item
          peminjam: item.nama_pengguna || '', 
          device: `${item.nama_komputer} ${item.model}`,
          status: item.status, 
          role: item.unit_organisasi || ''
        }));
        setData(fetchedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setUpdatedData(item);
    setEditModalVisible(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/komputer/${selectedItem.device}`, updatedData)
      .then(response => {
        console.log(response.data.message);
        // Refresh data or update state accordingly
        setEditModalVisible(false);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/komputer/${selectedItem.device}`)
      .then(response => {
        console.log(response.data.message);
        // Refresh data or update state accordingly
        setDeleteModalVisible(false);
      })
      .catch(error => {
        console.error('Error deleting data:', error);
      });
  };

  const filteredData = data.filter(item =>
    (peminjamFilter === '' || (peminjamFilter === "Kosong" ? item.peminjam === '' : item.peminjam === peminjamFilter)) &&
    (deviceFilter === '' || item.device === deviceFilter) &&
    (statusFilter === '' || item.status === statusFilter) &&
    (roleFilter === '' || (roleFilter === "Kosong" ? item.role === '' : item.role === roleFilter)) &&
    (
      item.peminjam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-32 mb-20 lg:mb-40" id="DeviceKantor">
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Device Kantor</h1>
        <div className="mt-2 mx-auto w-1/2 sm:w-1/3 lg:w-1/2 h-0.5 bg-gray-300"></div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row justify-center">
        <div className="flex items-center w-full max-w-lg space-x-2 mb-4 sm:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all fields..."
            className="w-full p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={() => setSearchQuery(searchQuery)}
            className="p-2 border border-gray-300 bg-gray-200 rounded-r"
          >
            Search
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="border-b">
              <th className="p-2">
                <select
                  value={peminjamFilter}
                  onChange={(e) => setPeminjamFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                >
                  <option value="">Peminjam</option>
                  {getUniqueValues('peminjam').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="p-2">
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                >
                  <option value="">Devices</option>
                  {getUniqueValues('device').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="p-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                >
                  <option value="">Status</option>
                  {getUniqueValues('status').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="p-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                >
                  <option value="">Roles</option>
                  {getUniqueValues('role').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="p-2">UPDATE</th>
              <th className="p-2">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.peminjam || 'Kosong'}</td>
                <td className="p-2">{item.device}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">{item.role || 'Kosong'}</td>
                <td className="p-2 text-green-600 cursor-pointer" onClick={() => handleEditClick(item)}>✏️</td>
                <td className="p-2 text-red-600 cursor-pointer" onClick={() => handleDeleteClick(item)}>🗑️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Update Device</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Device Name</label>
                <input
                  type="text"
                  value={updatedData.device}
                  onChange={(e) => setUpdatedData({ ...updatedData, device: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Add other fields similarly */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditModalVisible(false)} className="p-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="p-2 bg-green-500 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Delete Confirmation</h2>
            <p>Apakah Anda akan menghapus ID ini?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Iya</button>
              <button type="button" onClick={() => setDeleteModalVisible(false)} className="p-2 bg-gray-300 rounded">Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getUniqueValues(field) {
    return [...new Set(data.map(item => item[field]))];
  }
};

export default DeviceKantor;
