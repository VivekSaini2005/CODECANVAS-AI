import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axiosInstance"

import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

function ProblemWorkspace() {

  const { slug } = useParams()

  const [problem, setProblem] = useState(null)
  const [tags, setTags] = useState([])
  const [companies, setCompanies] = useState([])
  const [link, setLink] = useState("")

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(50) // percent
  const containerRef = useRef(null)
  const isResizing = useRef(false)

  const handleMouseDown = useCallback((e) => {
    isResizing.current = true
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100
    // Clamp between 20% and 80%
    setLeftWidth(Math.min(80, Math.max(20, newLeft)))
  }, [])

  const handleMouseUp = useCallback(() => {
    isResizing.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  useEffect(() => {

    const fetchProblem = async () => {

      const res = await API.get(`/problems/${slug}`)

      setProblem(res.data.problem)
      setTags(res.data.tags)
      setCompanies(res.data.companies)
      setLink(res.data.link)

    }

    fetchProblem()

  }, [slug])


  if (!problem) return <div className="text-gray-900 dark:text-white p-10">Loading...</div>


  return (

    <div className="h-screen flex flex-col bg-[#0B1120] text-white">

      {/* ================= WORKSPACE NAVBAR ================= */}

<div className="relative flex items-center justify-between flex-wrap gap-2 px-3 sm:px-6 py-3 border-b border-white/10 bg-[rgba(15,23,42,0.7)] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] sticky top-0 z-30 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-indigo-500/30 after:to-transparent">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          <a href="/problems" className="px-2 py-1 rounded-md text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-all duration-300 hover:-translate-x-[2px] flex items-center gap-1 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>       
            <span className="hidden sm:inline">Back</span>
          </a>

          <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0"></span>

          <h2 className="text-base sm:text-lg font-semibold tracking-tight bg-[length:200%_200%] animate-[gradientMove_4s_ease_infinite] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-300 truncate max-w-[150px] sm:max-w-none shrink-0">
            {problem.title}
          </h2>

          <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0"></span>

          <span className={`px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-300 shrink-0 ${
            problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
            'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
          }`}>
            {problem.difficulty}
          </span>

          <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block shrink-0"></span>

          <span className="text-[10px] sm:text-xs text-gray-500 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-md border border-white/10 hidden sm:inline-block shrink-0">leetcode</span>

          {tags.length > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block shrink-0"></span>
              <div className="hidden md:flex gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-xs">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 sm:px-2 py-0.5 bg-gray-800/40 text-gray-400 rounded-full border border-white/5 shrink-0">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-1"
          >
            <span className="hidden sm:inline">Original Problem</span>
            <span className="sm:hidden">Solve</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

      </div>


      {/* ================= WORKSPACE ================= */}

      <div ref={containerRef} className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden select-none">

        {/* LEFT WHITEBOARD */}

        <div className="w-full lg:w-auto h-[60vh] lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 bg-[#0F172A] flex flex-col overflow-hidden" style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${leftWidth}%` : undefined }}>

          <div className="p-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-800 flex-shrink-0">
            Logic Lab Whiteboard
          </div>

          <div className="flex-1 overflow-hidden">
            <Whiteboard problem={problem}/>
          </div>

        </div>

        {/* DRAG HANDLE / DIVIDER */}
        <div
          className="hidden lg:flex w-1.5 flex-shrink-0 bg-gray-800 hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>

        {/* RIGHT COMPILER */}

        <div className="bg-[#020617] flex-1 overflow-hidden min-h-[500px] lg:min-h-0">

          <Compiler />

        </div>

      </div>

    </div>

  )

}

export default ProblemWorkspace
