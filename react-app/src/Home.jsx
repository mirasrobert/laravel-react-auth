import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
axios.defaults.withCredentials = true; // Ensure cookies are sent with every requests
axios.defaults.withXSRFToken = true; // Ensure the XSRF token is sent with every request

const Home = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  );

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios
      .post('http://localhost:8000/logout', {})
      .then(() => {
        localStorage.removeItem('user');
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user');
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (error) {
      setUser(null);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-amber-600 w-full h-16 px-4 flex items-center">
      <div className="flex justify-between items-center w-full">
        {/* Left side: logo */}
        <div>
          <h1 className="text-white text-lg font-bold">MyApp</h1>
        </div>

        {/* Right side: welcome + logout */}
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-bold text-md">
            Welcome, {user ? user.name : 'Guest'}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-white text-amber-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
