import { useState, useEffect } from 'react';
import axios from 'axios';

const DeviceKantor = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [peminjamFilter, setPeminjamFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/devicekantor')
      .then(response => {
        const fetchedData = response.data.data.map(item => ({
          id: item.id_komputer, 
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

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      <div className="relative overflow-x-auto max-h-[470px]">
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
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.peminjam || 'Kosong'}</td>
                <td className="p-2">{item.device}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">{item.role || 'Kosong'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <nav className="inline-flex shadow-sm">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-l bg-gray-200 hover:bg-gray-300"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  );

  function getUniqueValues(field) {
    return [...new Set(data.map(item => (item[field] || 'Kosong')))];
  }
};

export default DeviceKantor;
