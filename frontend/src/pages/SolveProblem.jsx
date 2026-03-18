import { useParams, useLocation, Link } from "react-router-dom"
import { useRef, useState, useCallback, useEffect } from "react"
import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

export default function SolveProblem() {

  const { problemId } = useParams()
  const location = useLocation()

  const problem = location.state?.problem

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

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Problem data not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f1117] text-gray-200">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center gap-6 px-6 py-3 border-b border-[#1e2332] bg-[#121622]">

        {/* Back */}
        <Link
          to="/sheets"
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </Link>

        {/* Title */}
        <h1 className="font-semibold text-white">
          {problem.title}
        </h1>

        {/* Difficulty */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded
          ${problem.difficulty === "Easy"
              ? "bg-green-500/20 text-green-400"
              : problem.difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
        >
          {problem.difficulty}
        </span>

        {/* Platform */}
        <span className="text-xs text-gray-400">
          {problem.platform}
        </span>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Original Problem */}
        {problem.link && (
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-400 hover:underline"
          >
            Original Problem →
          </a>
        )}

      </div>


      {/* ================= TAGS + COMPANIES ================= */}
      <div className="px-6 py-2 border-b border-[#1e2332] flex flex-wrap gap-2">

        {problem.tags?.map(tag => (
          <span
            key={tag}
            className="text-xs bg-[#1c2233] px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}

        {problem.company_tags?.map(company => (
          <span
            key={company}
            className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded"
          >
            {company}
          </span>
        ))}

      </div>


      {/* ================= WORKSPACE ================= */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden select-none">

        {/* WHITEBOARD */}
        <div className="border-r border-[#1e2332] flex flex-col overflow-hidden" style={{ width: `${leftWidth}%` }}>
          <Whiteboard problem={problem} />
        </div>

        {/* DRAG HANDLE / DIVIDER */}
        <div
          className="w-1.5 flex-shrink-0 bg-[#1e2332] hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>

        {/* COMPILER */}
        <div className="flex-1 overflow-hidden">
          <Compiler />
        </div>

      </div>

    </div>
  )
}
