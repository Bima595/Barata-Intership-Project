import { useState, useEffect } from 'react';
import { data as DeviceKantorData } from './DeviceKantor';

const AsetKantor = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const calculateAsetByRole = () => {
      const asetByRole = DeviceKantorData.reduce((acc, item) => {
        const role = item.role || 'Aset Kosong'; // Use 'Aset Kosong' for empty role

        if (roleFilter === '' || role === roleFilter) {
          acc[role] = (acc[role] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedData = Object.entries(asetByRole).map(([role, count]) => ({ role, count }));
      setFilteredData(sortedData);
    };

    calculateAsetByRole();
  }, [roleFilter]);

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-32 mb-20 lg:mb-40">
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Aset Kantor</h1>
        <div className="mt-2 mx-auto w-1/2 sm:w-1/3 lg:w-1/2 h-0.5 bg-gray-300"></div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row justify-center">
        <div className="flex items-center w-full max-w-lg space-x-2 mb-4 sm:mb-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Semua Role</option>
            {[...new Set(DeviceKantorData.map(item => item.role || 'Aset Kosong'))].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="border-b">
              <th className="p-2">Organisasi Divisi</th>
              <th className="p-2">Jumlah Aset</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.role}</td>
                  <td className="p-2">{item.count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 text-center">Data Tidak Ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsetKantor;
