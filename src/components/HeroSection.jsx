const HeroSection = () => {
  return (
    <div className="container mx-auto mt-20 flex items-center justify-between px-6">
      <div className="max-w-xl flex-1">
        <h1 className="mg-4 text-4xl font-bold mb-4">Always Track & Analyze Your Business Statistics To Succeed.</h1>
        <p className="text-lg mb-6">A better way to manage your sales, team, clients & marketing — on a single platform. Powerful, affordable & easy.</p>
        <div className="flex space-x-2">
          <input type="text" placeholder="Enter your Devices" className="p-2 border border-gray-300 rounded" />
          <button className="p-2 bg-black text-white rounded">Get started</button>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <img className="max-w-xl" src="/Asset 5.png" alt="Illustration" />
      </div>
    </div>
  );
};

export default HeroSection;
