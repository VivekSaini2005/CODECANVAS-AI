import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, Moon, Sun, User as UserIcon, LogOut, Check, Menu } from "lucide-react"
import { fetchUserProfile } from "../api/authApi"
import { getNotifications, markNotificationRead } from "../api/discussApi"
import { useSocket } from "../hooks/useSocket"
import { useTheme } from "../context/ThemeContext"

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [userData, setUserData] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const notifRef = useRef(null)
  
  // Real-time socket initialization based on user ID
  const socket = useSocket(userData?.id);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      };

      socket.on("newNotification", handleNewNotification);

      return () => {
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, [socket]);

  // Listen for storage changes (in case token is set from login page in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        try {
          const data = await fetchUserProfile();
          setUserData(data);
        } catch (error) {
          console.error("Failed to load user profile in Navbar", error);
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
        try {
          const notifs = await getNotifications();
          setNotifications(notifs || []);
        } catch (error) {
          console.error("Failed to load notifications", error);
        }
      } else {
        setUserData(null);
        setNotifications([]);
      }
    };
    getUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    import("../hooks/useSocket").then(({ disconnectSocket }) => disconnectSocket());
    setToken(null);
    setUserData(null);
    setShowDropdown(false);
    navigate("/login");
  }

  const handleMarkAsRead = async (id) => {
    if (!id) return;
    try {
      await markNotificationRead(id);
      // Remove it from the panel once read
      setNotifications(prev => prev.filter(n => n.notification_id !== id && n.id !== id));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  const handleNotificationClick = async (notif) => {
    const id = notif.notification_id || notif.id;
    if (!notif.is_read) {
      await handleMarkAsRead(id);
    } else {
      setNotifications(prev => prev.filter(n => n.notification_id !== id && n.id !== id));
    }
    setShowNotifications(false);
    navigate('/discuss'); // Redirect to discussions
  }

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
      if (showNotifications && notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showNotifications]);

  // Safe fallback for user's First Name
  const userFirstName = userData?.name ? userData.name.split(' ')[0] : 'Coder';
  const seedUrl = userData?.name ? encodeURIComponent(userFirstName) : 'Coder';

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-[#0b0f1a]/80 py-4 px-3 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-white/5 transition-all duration-300 shadow-sm dark:shadow-none gap-3 sm:gap-4 flex-wrap">        

      {/* Hamburger Menu (Mobile Only) */}
      <button 
        onClick={onMenuClick}
        className="md:hidden text-gray-500 dark:text-gray-300 hover:text-[#625df5] p-2 hover:bg-[#625df5]/10 rounded-xl transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative hidden md:block group">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-colors group-hover:text-[#625df5]" />
        <input
          type="text"
          placeholder="Search problems, sheets, or tutorials..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              navigate(`/problems?search=${encodeURIComponent(e.target.value.trim())}`);
            }
          }}
          className="w-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 border border-transparent dark:border-white/5 rounded-full pl-12 pr-6 py-2.5 focus:outline-none focus:border-[#625df5] dark:focus:border-indigo-500/50 focus:ring-2 focus:ring-[#625df5]/30 transition-all text-sm group-hover:bg-gray-200 dark:group-hover:bg-white/10"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 sm:gap-4 sm:gap-6 md:gap-8 ml-auto">

        {/* Icons */}
        <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">

          {token && (
            <div className="relative profile-dropdown-container" ref={notifRef}>
              <button 
                className="text-gray-500 dark:text-gray-300 hover:text-[#625df5] dark:hover:text-indigo-400 transition-all duration-200 hover:scale-110 relative flex items-center justify-center p-2 rounded-full hover:bg-[#625df5]/10" 
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0a0d14]"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#121622] rounded-xl shadow-xl border border-gray-100 dark:border-[#1e2332] py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-[#1e2332] flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <span className="text-xs bg-indigo-100 text-[#625df5] px-2 py-0.5 rounded-full">
                      {notifications.filter(n => !n.is_read).length} new
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`cursor-pointer px-4 py-3 border-b border-gray-50 dark:border-[#1a1f2e] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-[#1a1f2e] transition-colors ${!notif.is_read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 pr-4">
                              {notif.message}
                            </p>
                            {!notif.is_read && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent closing
                                  handleMarkAsRead(notif.notification_id || notif.id);
                                }}
                                className="text-gray-500 dark:text-gray-400 hover:text-[#625df5] flex-shrink-0"
                                title="Mark as read"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-yellow-500/10" title="Toggle Theme">
            {theme === "dark" ? <Sun size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> : <Moon size={20} />}
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

        {/* User Auth Section */}
        {token ? (
          <div className="relative profile-dropdown-container">
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#625df5] dark:group-hover:text-indigo-400 transition-colors drop-shadow-sm">{userFirstName}</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-wider"></span>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#625df5] to-[#45b7f1] p-[2px] cursor-pointer hover:scale-105 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-2 ring-transparent group-hover:ring-[#625df5]/50">
                <div className="w-full h-full bg-white dark:bg-[#0b0f1a] rounded-full overflow-hidden flex flex-col justify-end items-center">
                  <img src={`${userData?.profileimage}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#121622] rounded-xl shadow-xl border border-gray-100 dark:border-[#1e2332] overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1e2332] sm:hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userData?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-[#1a1f2e] hover:text-[#625df5] dark:hover:text-white transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserIcon size={16} />
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="text-sm font-semibold bg-[#625df5] hover:bg-[#524de3] text-white px-4 py-2 rounded-xl transition-colors shadow-md">Register</Link>
          </div>
        )}

      </div>

    </div>
  )
}

export default Navbar