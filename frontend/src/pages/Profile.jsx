// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchUserProfile, updateUserProfile } from '../api/authApi';
// import { User, LogOut, Edit2, Save, X } from 'lucide-react';

// const Profile = () => {
//   const [user, setUser] = useState({ name: '', email: '', leetcode_username: '', codeforces_username: '', codechef_username: '', profileimage: '' });
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await fetchUserProfile();
//         setUser(data);
//         setFormData(data);
//       } catch (error) {
//         console.error("Failed to fetch user profile", error);
//         if (error.response?.status === 401) {
//           handleLogout();
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.dispatchEvent(new Event('storage'));
//     navigate('/login');
//   };

//   const handleEditToggle = () => {
//     if (editMode) {
//       setFormData(user);
//     }
//     setEditMode(!editMode);
//     setError('');
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError('');
//     try {
//       const response = await updateUserProfile(formData);
//       setUser(response.user);
//       setFormData(response.user);
//       setEditMode(false);
//       window.dispatchEvent(new Event('storage'));
//     } catch (err) {
//       setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : 'U';
//   };

//   if (loading) {
//     return <div className="flex h-[calc(100vh-80px)] items-center justify-center text-gray-500 dark:text-gray-400">Loading profile data...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-20">

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
//           <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your account details and coding platform identities.</p>
//         </div>
//         {!editMode ? (
//           <button
//             onClick={handleEditToggle}
//             className="flex items-center gap-2 bg-[#625df5] hover:bg-[#524de3] text-white px-5 py-2.5 rounded-xl transition-all shadow-md text-sm font-semibold"
//           >
//             <Edit2 size={16} /> Edit Profile
//           </button>
//         ) : (
//           <div className="flex gap-3">
//             <button
//               onClick={handleEditToggle}
//               className="flex items-center gap-2 bg-gray-200 dark:bg-[#1a1f2e] hover:bg-gray-300 dark:hover:bg-gray-300 dark:hover:bg-[#252b3d] text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl transition-all text-sm font-semibold"
//               disabled={saving}
//             >
//               <X size={16} /> Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl transition-all shadow-md text-sm font-semibold disabled:opacity-70"
//             >
//               <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl p-4 flex items-center gap-3">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-[#1e2332] shadow-xl dark:shadow-none transition-colors">

//         <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-100 dark:border-[#1e2332] pb-10">
//           <div className="relative">
//             <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-[#625df5] to-[#45b7f1] p-1 shadow-lg">
//               <div className="w-full h-full bg-white dark:bg-[#1a1f2e] rounded-[20px] overflow-hidden flex flex-col items-center justify-end">
//                 <img src={`${user.profileimage}`} alt="avatar" className="w-full h-full object-cover" />
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 space-y-2 text-center md:text-left mt-2">
//             {editMode ? (
//               <div className="space-y-4 max-w-sm mx-auto md:mx-0">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name || ''}
//                     onChange={handleChange}
//                     className="w-full bg-gray-50 dark:bg-[#0a0d14] border border-gray-200 dark:border-[#1e2332] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#625df5] focus:ring-1 focus:ring-[#625df5] transition-all"
//                     placeholder="Your Name"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{user.name}</h2>
//                 <div className="inline-flex items-center px-3 py-1 mt-1 rounded-lg bg-gray-100 dark:bg-[#1a1f2e] text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-transparent">
//                   {user.email}
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="md:ml-auto mt-4 md:mt-2">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-100 dark:border-transparent cursor-pointer"
//             >
//               <LogOut size={16} /> Sign out
//             </button>
//           </div>
//         </div>

//         {/* Platform Integration Section */}
//         <div className="pt-10">
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//             Platform Integrations
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//             {/* LeetCode */}
//             <div className="bg-gray-50 dark:bg-[#0a0d14] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2332] transition-colors relative overflow-hidden group">
//               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f89f1b]"></div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">LeetCode Username</label>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="leetcode_username"
//                   value={formData.leetcode_username || ''}
//                   onChange={handleChange}
//                   className="w-full bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#f89f1b] focus:ring-1 focus:ring-[#f89f1b] transition-all text-sm ml-1"
//                   placeholder="e.g. tourist"
//                 />
//               ) : (
//                 <div className="text-base font-semibold text-gray-900 dark:text-gray-200 mt-1 ml-1">
//                   {user.leetcode_username || <span className="text-gray-500 dark:text-gray-400 italic text-sm font-medium">Not connected</span>}
//                 </div>
//               )}
//             </div>

//             {/* Codeforces */}
//             <div className="bg-gray-50 dark:bg-[#0a0d14] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2332] transition-colors relative overflow-hidden group">
//               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3b5998]"></div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">CodeForces Username</label>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="codeforces_username"
//                   value={formData.codeforces_username || ''}
//                   onChange={handleChange}
//                   className="w-full bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#3b5998] focus:ring-1 focus:ring-[#3b5998] transition-all text-sm ml-1"
//                   placeholder="e.g. tourist"
//                 />
//               ) : (
//                 <div className="text-base font-semibold text-gray-900 dark:text-gray-200 mt-1 ml-1">
//                   {user.codeforces_username || <span className="text-gray-500 dark:text-gray-400 italic text-sm font-medium">Not connected</span>}
//                 </div>
//               )}
//             </div>

//             {/* CodeChef */}
//             <div className="bg-gray-50 dark:bg-[#0a0d14] rounded-2xl p-5 border border-gray-100 dark:border-[#1e2332] transition-colors relative overflow-hidden group">
//               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5B4638]"></div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">CodeChef Username</label>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="codechef_username"
//                   value={formData.codechef_username || ''}
//                   onChange={handleChange}
//                   className="w-full bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#5B4638] focus:ring-1 focus:ring-[#5B4638] transition-all text-sm ml-1"
//                   placeholder="e.g. tourist"
//                 />
//               ) : (
//                 <div className="text-base font-semibold text-gray-900 dark:text-gray-200 mt-1 ml-1">
//                   {user.codechef_username || <span className="text-gray-500 dark:text-gray-400 italic text-sm font-medium">Not connected</span>}
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from '../api/authApi';
import API from '../api/axiosInstance';
import { LogOut, Edit2, Save, X, Camera } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    leetcode_username: '',
    codeforces_username: '',
    codechef_username: '',
    profileimage: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
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
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const handleEditToggle = () => {
    if (editMode) {
      setFormData(user);
      setPreviewImage('');
      setImageFile(null);
    }
    setEditMode(!editMode);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      let updatedUser = { ...formData };

      // Upload image if selected
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append("image", imageFile);

        const res = await API.post("/user/upload-profile", formDataImg, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        updatedUser.profileimage = res.data.image;
      }

      // Update profile
      const response = await updateUserProfile(updatedUser);

      // 🔥 FIX: handle both response formats
      const updated = response.user || response;

      setUser(updated);
      setFormData(updated);
      setEditMode(false);
      setPreviewImage('');
      setImageFile(null);

      window.dispatchEvent(new Event('storage'));

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center text-gray-500">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>

        {!editMode ? (
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 bg-[#625df5] text-white px-4 py-2 rounded-xl"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleEditToggle} className="px-4 py-2 bg-gray-500 rounded-xl">
              <X size={16} />
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 rounded-xl">
              <Save size={16} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-[#121622] p-6 rounded-3xl">

        <div className="flex items-center gap-6">

          {/* IMAGE */}
          <div className="relative">
            <div className="h-32 w-32 rounded-2xl overflow-hidden bg-gray-700">
              <img
                src={previewImage || user.profileimage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {editMode && (
              <label className="absolute bottom-2 right-2 bg-[#625df5] p-2 rounded-full cursor-pointer">
                <Camera size={16} className="text-gray-900 dark:text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* USER INFO */}
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-[#0a0d14] border border-gray-200 dark:border-[#1e2332] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#625df5]"
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="text-red-400 flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* PLATFORM SECTION */}
        <div className="pt-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Platform Integrations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {[
              { label: "LeetCode Username", name: "leetcode_username", color: "#f89f1b" },
              { label: "Codeforces Username", name: "codeforces_username", color: "#3b5998" },
              { label: "CodeChef Username", name: "codechef_username", color: "#5B4638" }
            ].map((platform) => (
              <div
                key={platform.name}
                className="bg-gray-50 dark:bg-[#0a0d14] rounded-2xl p-5 border border-gray-200 dark:border-[#1e2332] relative"
              >
                <div
                  className="absolute top-0 left-0 w-1.5 h-full"
                  style={{ backgroundColor: platform.color }}
                ></div>

                <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase mb-2 ml-2">
                  {platform.label}
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name={platform.name}
                    value={formData[platform.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-3 py-2"
                  />
                ) : (
                  <div className="text-gray-900 dark:text-gray-200 ml-2">
                    {user[platform.name] || (
                      <span className="text-gray-500 text-sm">Not connected</span>
                    )}
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
