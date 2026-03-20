import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function MainLayout({ children }) {
  const location = useLocation()
  
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
      
      <div className="flex flex-1 overflow-hidden h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout