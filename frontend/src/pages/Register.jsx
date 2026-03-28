import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, googleLoginUser } from '../api/authApi';
import { Code2, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLoginUser(credentialResponse.credential);
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to register with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(formData);
      if (data.token) {
        localStorage.setItem('token', data.token);

        // Dispatch a storage event so Navbar re-renders immediately
        window.dispatchEvent(new Event('storage'));
      }
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0d14] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#121622] p-8 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#1e2332] transition-colors duration-200">

        <div className="flex flex-col items-center">
          <div className="mt-15 w-12 h-12 rounded-xl bg-gradient-to-br from-[#625df5] to-[#45b7f1] flex items-center justify-center shadow-lg mb-4">
            <Code2 size={24} className="text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Join us to start your journey
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Registration Failed')}
              useOneTap
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#1e2332]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#121622] text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-[#1e2332] bg-gray-50 dark:bg-[#0a0d14] px-4 py-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#625df5] focus:outline-none focus:ring-1 focus:ring-[#625df5] sm:text-sm transition-all shadow-sm dark:shadow-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-[#1e2332] bg-gray-50 dark:bg-[#0a0d14] px-4 py-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#625df5] focus:outline-none focus:ring-1 focus:ring-[#625df5] sm:text-sm transition-all shadow-sm dark:shadow-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-[#1e2332] bg-gray-50 dark:bg-[#0a0d14] px-4 py-3 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#625df5] focus:outline-none focus:ring-1 focus:ring-[#625df5] sm:text-sm transition-all shadow-sm dark:shadow-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#625df5] py-3.5 px-4 text-sm font-semibold text-white hover:bg-[#524de3] focus:outline-none focus:ring-2 focus:ring-[#625df5] focus:ring-offset-2 dark:focus:ring-offset-[#121622] disabled:opacity-70 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? 'Creating account...' : 'Sign up'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            <div className="text-center text-sm pt-2">
              <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
              <Link to="/login" className="font-semibold text-[#625df5] hover:text-[#524de3] transition-colors">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
