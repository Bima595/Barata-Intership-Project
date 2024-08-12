import LoginForm from '../components/Login/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: 'url(/Kantor.jpg)' }}></div>
      <div className="w-full md:w-1/3 bg-white flex flex-col items-center justify-center relative p-4">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <img src="/Barata.jpeg" alt="Second Logo" className="h-8 md:h-20" />
          <img src="/BUMN.png" alt="First Logo" className="h-8 md:h-9 -mt-9" />
        </div>
        <div className="p-8 shadow-md rounded-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "#29166F" }}>OfficeTech.</h1>
          <LoginForm />
        </div>
        <div className="absolute bottom-0 left-0 w-full text-center mb-4">
          <p className="text-sm" style={{ color: "#808080" }}>&copy; 2024 Barata Indonesia (Persero). All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
