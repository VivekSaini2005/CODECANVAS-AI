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

      {/* ================= NAVBAR ================= */}

      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800">

        <div className="flex items-center gap-6">

          <h1 className="font-bold text-lg text-indigo-400">
            CodeCanvas AI
          </h1>

          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="cursor-pointer hover:text-white">Problems</span>
            <span className="cursor-pointer hover:text-white">Contests</span>
            <span className="cursor-pointer hover:text-white">Leaderboard</span>
          </div>

        </div>

        <input
          className="bg-[#111827] px-3 py-1 rounded text-sm outline-none"
          placeholder="Jump to problem..."
        />

      </div>


      {/* ================= PROBLEM HEADER ================= */}

      <div className="px-6 py-4 border-b border-gray-800 space-y-2">

        {/* TITLE + DIFFICULTY */}

        <div className="flex items-center gap-3">

          <h2 className="text-lg font-semibold">
            {problem.title}
          </h2>

          <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded">
            {problem.difficulty}
          </span>

        </div>


        {/* TAGS */}

        <div className="flex gap-2 flex-wrap text-xs">

          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 rounded"
            >
              {tag}
            </span>
          ))}

        </div>


        {/* COMPANIES */}

        <div className="flex gap-2 flex-wrap text-xs">

          {companies.map(company => (
            <span
              key={company}
              className="px-2 py-1 bg-indigo-900 text-indigo-300 rounded"
            >
              {company}
            </span>
          ))}

        </div>


        {/* ORIGINAL LINK */}

        <div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-400 hover:underline"
          >
            Original Problem →
          </a>

        </div>

      </div>


      {/* ================= WORKSPACE ================= */}

      <div ref={containerRef} className="flex flex-1 overflow-hidden select-none">

        {/* LEFT WHITEBOARD */}

        <div className="border-r border-gray-800 bg-[#0F172A] flex flex-col overflow-hidden" style={{ width: `${leftWidth}%` }}>

          <div className="p-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-800 flex-shrink-0">
            Logic Lab Whiteboard
          </div>

          <div className="flex-1 overflow-hidden">
            <Whiteboard problem={problem}/>
          </div>

        </div>

        {/* DRAG HANDLE / DIVIDER */}
        <div
          className="w-1.5 flex-shrink-0 bg-gray-800 hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>

        {/* RIGHT COMPILER */}

        <div className="bg-[#020617] flex-1 overflow-hidden">

          <Compiler />

        </div>

      </div>

    </div>

  )

}

export default ProblemWorkspace