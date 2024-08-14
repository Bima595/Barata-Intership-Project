import React from 'react';
import VShapeArrow from './VShapeArrow';

const HistoryPinjamLaptop = () => {
  const historyData = [
    {
      name: "Sundoyo Agung",
      department: "Direksi IT",
      period: "19 Oktober - 19 Desember 2024"
    },
    {
      name: "Budi Santoso",
      department: "HRD",
      period: "01 November - 01 Desember 2024"
    },
    {
      name: "Siti Nurhaliza",
      department: "Finance",
      period: "10 Oktober - 10 November 2024"
    },
    {
      name: "Siti Nurhaliza",
      department: "Finance",
      period: "10 Oktober - 10 November 2024"
    }
  ];

  return (
    <div className="mt-6  px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Pinjam Laptop</h1>
      <div className="relative ml-6">
        <div className="absolute top-0 bottom-0 w-1 bg-black left-0"></div>
        {historyData.map((entry, index) => (
          <div key={index} className="flex items-center mb-10 relative">
            <div className="absolute left-[-4px] top-2.5 w-3 h-3 bg-black rounded-full z-10"></div>
            <div className="ml-10 w-full">
              <h2 className="text-xl">{entry.name}</h2>
              <p className="text-lg font-semibold">{entry.department}</p>
              <p className="text-base">{entry.period}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-[-16px] left-[-6px]">
          <VShapeArrow size={16} color="black" />
        </div>
      </div>
    </div>
  );
};

export default HistoryPinjamLaptop;
