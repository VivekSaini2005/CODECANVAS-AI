import { useEffect, useState } from "react"
import API from "../api/axiosInstance"
import { Link } from "react-router-dom"
import ProgressBar from "../components/ProgressBar"

function Sheets() {

  const [sheets, setSheets] = useState([])

  useEffect(() => {

    const fetchSheets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(token ? "/sheets/sheet-progress" : "/sheets");
        setSheets(res.data)
      } catch(err) {
        console.error(err);
      }
    }

    fetchSheets()

  }, [])

  return (

    <div className="p-3 sm:p-4 md:p-6">

      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">
          DSA Sheets
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your DSA progress across sheets
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {sheets.map(sheet => (

          <Link key={sheet.id} to={`/sheet/${sheet.id}`} className="flex">

            <div className="flex-1 relative rounded-2xl p-3 sm:p-5 bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent border border-gray-200 dark:border-white/10 shadow-soft hover:translate-y-[-3px] hover:shadow-xl transition-all duration-300 before:absolute before:inset-0 before:rounded-2xl before:bg-black/5 dark:before:bg-white/5 before:opacity-0 hover:before:opacity-100 before:pointer-events-none group">

            <div className="relative z-10 flex justify-between items-center mb-3 gap-3">
              <h2 className="text-sm md:text-base lg:text-lg font-semibold tracking-tight group-hover:text-[#625df5] transition-colors duration-200 truncate">
                {sheet.name}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
                {Math.round(sheet.progress || 0)}%
              </span>
            </div>

            <p className="relative z-10 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 md:line-clamp-none">
              {sheet.description}
            </p>

            <div className="relative z-10 mt-4">
              <ProgressBar value={sheet.progress} />
            </div>

            <div className="relative z-10 mt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{Math.round((sheet.progress || 0) * (sheet.total_problems || 50) / 100) || 0} / {sheet.total_problems || 150} completed</span>
              
              <div className="flex gap-1.5 opacity-70">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
              </div>
            </div>

          </div>

        </Link>

        ))}
      </div>

    </div>

  )

}

export default Sheets