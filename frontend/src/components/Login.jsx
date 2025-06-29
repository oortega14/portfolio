import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Admin Login</h2>

        {error && (
          <div className="mb-4 rounded bg-red-500 p-3 text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-white" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded bg-slate-700 p-2 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-white" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded bg-slate-700 p-2 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 px-4 text-white hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;