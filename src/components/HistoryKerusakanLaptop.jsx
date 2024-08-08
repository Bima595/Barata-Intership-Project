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
    <div className="mt-24 px-32 md:px-32">
      <h1 className="text-2xl font-bold mb-6 md:ml-3">History Kerusakan Laptop</h1>
      <div className="rrelative md:ml-32">
        {historyData.map((entry, index) => (
          <div key={index} className="flex items-center mb-10 relative">
            <div className="absolute left-[-0px] top-2.5 text-lg font-bold text-black">{index + 1}.</div>
            <div className="ml-10 w-full">
              <h2 className="text-xl">{entry.name}</h2>
              <p className="text-lg font-semibold">{entry.department}</p>
              <p className="text-base">{entry.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryKerusakanLaptop;
