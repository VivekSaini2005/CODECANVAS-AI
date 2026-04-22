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
    <>
      <div className="animate-fade-in-up w-full py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 border-b border-gray-100 dark:border-white/5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        
        <div className="flex-1 flex flex-col items-start gap-4 md:gap-6 backdrop-blur-md bg-white/40 dark:bg-gray-900/40 p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-sm transition-all duration-300 z-10 relative">
          <span className="inline-block py-1 px-3 rounded-full bg-[#625df5]/10 text-[#625df5] dark:text-[#8884ff] text-xs font-semibold tracking-wide border border-[#625df5]/20 uppercase">
            CodeCanvas AI
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.2] md:leading-[1.15]">
            Master DSA with <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-[#625df5] to-[#f55d7a] bg-clip-text text-transparent">Structured Sheets</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
            Unified DSA sheets with smart progress tracking and zero duplication.
          </p>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 mb-2">
            <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 transition-colors">
              Unified Tracking
            </span>
            <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 transition-colors">
              No Duplicate Problems
            </span>
            <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 transition-colors">
              Custom Roadmaps
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
            <button 
              onClick={() => document.getElementById('sheets-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              Explore Sheets
            </button>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-end w-full z-10 relative">
          <div className="animate-float relative w-full max-w-[450px] xl:max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-transparent dark:border-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#625df5]/10 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"></div>
            <img 
              src="/src/images/ProblemImg.png" 
              alt="Minimal AI coding dashboard illustration" 
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>

      </div>

      <div id="sheets-section" className="p-3 sm:p-4 md:p-6">

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
    </>

  )

}

export default Sheets