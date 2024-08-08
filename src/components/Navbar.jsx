import{ useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-black bg-gray-100" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-xl font-bold">OfficeTech.</div>
        <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Data Table</a>
          <a href="#" className="hover:underline">Feature</a>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-100 py-4 px-6">
          <a href="#" className="block py-2 hover:underline">Home</a>
          <a href="#" className="block py-2 hover:underline">Data Table</a>
          <a href="#" className="block py-2 hover:underline">Feature</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
