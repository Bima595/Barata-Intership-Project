const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full text-black" style={{backgroundColor:"#F5F7FA"}}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-xl font-bold">OfficeTech.</div>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Data Table</a>
          <a href="#" className="hover:underline">Feature</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
