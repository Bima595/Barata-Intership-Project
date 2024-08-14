import { useState } from 'react';

export const data = [
  { peminjam: "Andi", device: "Asus A14E002", status: "Aktif", role: "K3LH" },
  { peminjam: "Ardo", device: "Lenovo Thinkpad 14E1", status: "Tidak Aktif", role: "Kontraktor" },
  { peminjam: "Supono", device: "Monitor LG 19 inch 14GG2i", status: "Perbaikan", role: "SPI" },
  { peminjam: "Supardi", device: "Speaker LG Sub 24 G2", status: "Hilang", role: "Petinggi" },
  { peminjam: "", device: "Asus 14XAAE", status: "Tidak Terpakai", role: "" },
  { peminjam: "", device: "Acer Aspire 5", status: "Tidak Terpakai", role: "" },
  { peminjam: "", device: "Lenovo Ideapad 3", status: "Tidak Terpakai", role: "" }
];

const getUniqueValues = (field) => {
  const values = data.map(item => item[field] || "Kosong");
  return [...new Set(values)];
};

const DeviceKantor = () => {
  const [peminjamFilter, setPeminjamFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
                  className="w-full p-2 border border-gray-300 rounded"
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
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Device</option>
                  {getUniqueValues('device').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="p-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
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
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Role</option>
                  {getUniqueValues('role').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.peminjam || "Kosong"}</td>
                  <td className="p-2">{item.device}</td>
                  <td className={`p-2 ${item.status === 'Aktif' ? 'bg-green-200' : item.status === 'Tidak Aktif' ? 'bg-red-200' : item.status === 'Perbaikan' ? 'bg-yellow-200' : item.status === 'Tidak Terpakai' ? 'bg-blue-200' : 'bg-white'}`}>{item.status}</td>
                  <td className="p-2">{item.role || "Kosong"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">Data Tidak Ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceKantor;
