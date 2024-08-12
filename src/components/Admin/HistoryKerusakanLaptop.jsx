const HistoryKerusakanLaptop = () => {
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
  ];

  return (
    <div className="mt-6 px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Kerusakan Laptop</h1>
      <div className="relative ml-8">
        {historyData.map((entry, index) => (
          <div key={index} className="flex items-start mb-10 relative">
            <div className="absolute left-[-1.5rem] top-2.5 text-lg font-bold text-black">
              {index + 1}.
            </div>
            <div className="ml-8 w-full">
              <h2 className="text-lg sm:text-xl font-semibold">{entry.name}</h2>
              <p className="text-base font-semibold">{entry.department}</p>
              <p className="text-sm">{entry.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryKerusakanLaptop;
