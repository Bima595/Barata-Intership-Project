import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: 'url(/Kantor.jpg)' }}></div>
      <div className="w-full md:w-1/3 bg-white flex flex-col items-center justify-center relative p-4">
        <div className="absolute top-4 right-4 md:right-4 flex space-x-2">
          <img src="/BUMN.png" alt="First Logo" className="h-8 md:h-12" />
          <img src="/Barata.png" alt="Second Logo" className="h-8 md:h-12" />
        </div>
        <div className="p-8 shadow-md rounded-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">OfficeTech.</h1>
          <LoginForm />
        </div>
        <div className="text-center mt-4 w-full">
          <p className="text-sm">&copy; 2024 Barata Indonesia(Persero). All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
