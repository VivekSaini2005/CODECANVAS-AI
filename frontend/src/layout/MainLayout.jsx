import Sidebar from "../components/Sidebar"

function MainLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>

    </div>
  )
}

export default MainLayout