import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import axios from 'axios';
axios.defaults.withCredentials = true; // Ensure cookies are sent with every requests
axios.defaults.withXSRFToken = true; // Ensure the XSRF token is sent with every request

function App() {
  let navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
	const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };

    // First, get the CSRF cookie,
    await axios.get('http://localhost:8000/sanctum/csrf-cookie');

    try {
      const login = await axios.post('http://localhost:8000/login', formData);
      localStorage.setItem('user', JSON.stringify(login.data.data.user));
      navigate('/home');
    } catch (error) {
      setError(error.response.data.message || 'Login failed');
    }
  };

  const fetchUser = async (useAlert) => {
    await axios
      .get('http://localhost:8000/api/user')
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch(() => {
        if (useAlert) {
          alert('No user logged in');
        }
        localStorage.removeItem('user');
      });
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <h5 className="text-xl font-medium text-gray-900 ">
              Sign in to our platform
            </h5>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@company.com"
                
              />
							{ error && <p className="mt-2 text-sm text-red-600">{error}</p> }
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-600">
              Not registered?{' '}
              <a
                href="#"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
