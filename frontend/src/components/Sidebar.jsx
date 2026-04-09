import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Code2,
  BarChart2,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();

  // Reset desktop collapse state and handle window resizes for responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsDesktopCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const collapsed = isDesktopCollapsed && !isMobile;

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Problem Sheets", path: "/sheets", icon: FileText },
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Leaderboard", path: "/leaderboard", icon: BarChart2 },
    { name: "Discuss", path: "/discuss", icon: MessageSquare },
  ];

  const bottomNavItems = [
    { name: "Profile", path: "/profile", icon: User },
  ];

  // ✅ FIX: handle nested routes properly
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`fixed md:relative top-0 left-0 h-screen z-50 md:z-40 bg-white dark:bg-gradient-to-b dark:from-[#0b0f1a] dark:to-[#0f172a] border-r border-gray-200 dark:border-white/5 flex flex-col glass shadow-soft transition-all duration-300 ease-in-out
      w-64 ${collapsed ? "md:w-20" : "md:w-64"} 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-visible`}
    >

      {/* Toggle Button (Desktop Only) */}
      <div
        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        className="hidden md:flex absolute top-6 right-0 translate-x-1/2 z-50 w-9 h-9 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-md dark:shadow-lg items-center justify-center cursor-pointer hover:scale-110 active:scale-95 hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out group focus:outline-none"        
      >
        <ChevronLeft size={16} className={`text-gray-600 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </div>

      {/* Logo */}
      <div className={`px-5 py-8 flex items-center ${collapsed ? "justify-center" : "gap-3"} transition-all duration-300`}>
        <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#625df5] to-[#45b7f1] shadow-lg shadow-indigo-500/30">
          <Code2 size={20} className="text-white" />
        </div>
        {collapsed ? null : (
          <h1 className="text-2xl font-bold tracking-wide dark:text-white whitespace-nowrap opacity-100 transition-opacity duration-300">
            CodeCanvas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#625df5] to-[#45b7f1] text-sm ml-1">AI</span>
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col px-4 py-2 flex-1 overflow-x-hidden">

        {/* Top Nav */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link key={item.name} to={item.path} onClick={() => { if (isMobile && onClose) onClose(); }}
                className={`group relative flex items-center ${collapsed ? "justify-center px-0 w-12 mx-auto" : "gap-4 px-4"} py-3.5 rounded-xl transition-all duration-300 ease-in-out ${
                  active
                    ? "bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-600/20 dark:to-blue-600/10 text-[#625df5] dark:text-indigo-300 font-bold dark:border border-transparent dark:border-indigo-500/20 dark:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {/* Active Indicator Dot */}
                {collapsed && active && (
                  <div className="absolute left-1 w-1.5 h-1.5 rounded-full bg-[#625df5] shadow-[0_0_8px_#625df5] transition-all duration-300"></div>
                )}

                <div className="p-1 rounded-lg transition-transform duration-200 group-hover:scale-110 group-hover:bg-black/5 dark:group-hover:bg-white/5 flex items-center justify-center">
                  <item.icon
                    size={22}
                    className={`shrink-0 transition-opacity duration-200 ${
                      active ? "text-[#625df5] dark:text-indigo-400 opacity-100" : "text-gray-500 dark:text-gray-400 opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </div>
                
                {collapsed ? null : (
                  <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">{item.name}</span>
                )}

                {/* Tooltip */}
                {collapsed && (
                   <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded-md shadow-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                     {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className={`my-4 border-t border-gray-200 dark:border-white/5 ${collapsed ? "mx-4" : "mx-2"} transition-all duration-300`} />

        {/* Bottom Nav */}
        <div className="flex flex-col gap-2 mt-auto pb-6">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link key={item.name} to={item.path} onClick={() => { if (isMobile && onClose) onClose(); }}
                className={`group relative flex items-center ${collapsed ? "justify-center px-0 w-12 mx-auto" : "gap-4 px-4"} py-3.5 rounded-xl transition-all duration-300 ease-in-out ${
                  active
                    ? "bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-600/20 dark:to-blue-600/10 text-[#625df5] dark:text-indigo-300 font-bold dark:border border-transparent dark:border-indigo-500/20 dark:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {/* Active Indicator Dot */}
                {collapsed && active && (
                  <div className="absolute left-1 w-1.5 h-1.5 rounded-full bg-[#625df5] shadow-[0_0_8px_#625df5] transition-all duration-300"></div>
                )}

                <div className="p-1 rounded-lg transition-transform duration-200 group-hover:scale-110 group-hover:bg-black/5 dark:group-hover:bg-white/5 flex items-center justify-center">
                  <item.icon
                    size={22}
                    className={`shrink-0 transition-opacity duration-200 ${
                      active ? "text-[#625df5] dark:text-indigo-400 opacity-100" : "text-gray-500 dark:text-gray-400 opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </div>
                
                {collapsed ? null : (
                  <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">{item.name}</span>
                )}

                {/* Tooltip */}
                {collapsed && (
                   <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded-md shadow-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                     {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </div>

      </div>

    </div>
  );
}

export default Sidebar;