import { useState } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function MainLayout({ children }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hideLayout = location.pathname.startsWith('/solve') || location.pathname.startsWith('/problem/')

  if (hideLayout) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0d14] text-gray-900 dark:text-gray-200 font-sans transition-colors duration-200">
        {children}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0d14] text-gray-900 dark:text-gray-200 font-sans transition-colors duration-200">

      <div className="flex flex-1 overflow-hidden h-screen relative">
        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="flex-1 flex flex-col h-screen w-full overflow-hidden">
          <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto basis-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout