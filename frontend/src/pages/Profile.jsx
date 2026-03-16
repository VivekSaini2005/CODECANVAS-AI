import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        // If unauthorized, token might be invalid
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">User Profile</h1>
      
      {loading ? (
        <div className="text-center text-gray-400">Loading profile...</div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
            <div className="h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-md border-4 border-gray-700">
              {getInitial(user.name)}
            </div>
            
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-semibold text-white">{user.name || "Your Account"}</h2>
                <p className="text-gray-400 mt-1">{user.email || "Manage your profile and preferences."}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
