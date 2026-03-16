import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  FileText, 
  Code2, 
  Cpu, 
  BarChart2, 
  Bot, 
  User, 
  Settings 
} from "lucide-react"

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Problem Sheets", path: "/sheets", icon: FileText },
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Logic Lab", path: "/logic-lab", icon: Cpu },
    { name: "Leaderboard", path: "/leaderboard", icon: BarChart2 },
    { name: "AI Tutor", path: "/ai-tutor", icon: Bot },
  ]

  const bottomNavItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="w-64 bg-white dark:bg-[#0f121b] border-r border-gray-200 dark:border-[#1e2332] flex flex-col h-full sticky top-0 transition-colors duration-200 z-10 shadow-sm text-sm">
      
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#625df5] to-[#45b7f1] flex items-center justify-center shadow-lg">
          <Code2 size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
          CodeCanvas <span className="text-[#625df5] text-sm ml-1 font-bold">AI</span>
        </h1>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-2 flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path) 
                ? "bg-indigo-50 dark:bg-[#1e2332] text-[#625df5] font-semibold" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1f2e] font-medium"
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? "text-[#625df5]" : "text-gray-400 dark:text-gray-500"} />
            <span>{item.name}</span>
          </Link>
        ))}

        <div className="my-4 border-t border-gray-100 dark:border-[#1e2332] mx-4 transition-colors"></div>

        {bottomNavItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path) 
                ? "bg-indigo-50 dark:bg-[#1e2332] text-[#625df5] font-semibold" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1f2e] font-medium"
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? "text-[#625df5]" : "text-gray-400 dark:text-gray-500"} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Upgrade Card */}
      <div className="p-4 mt-auto mb-4">
        <div className="bg-gradient-to-br from-[#625df5] to-[#45b7f1] rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider block mb-1">Current Tier</span>
            <h3 className="text-white font-bold text-lg leading-tight mb-3">Free Explorer</h3>
            <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Sidebar