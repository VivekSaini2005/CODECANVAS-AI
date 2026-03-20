import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useRef, useState, useCallback, useEffect } from "react"
import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Bot, X, Code2, Cpu } from "lucide-react"

export default function SolveProblem() {

  const { problemId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const problem = location.state?.problem

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(50) // percent
  const containerRef = useRef(null)
  const isResizing = useRef(false)

  // AI result lifted from Whiteboard
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Right panel active tab: "compiler" | "ai"
  const [rightTab, setRightTab] = useState("compiler")

  // Called by Whiteboard when an AI action starts
  const handleAIStart = useCallback(() => {
    setAiLoading(true)
    setRightTab("ai")
  }, [])

  // Called by Whiteboard when an AI result arrives
  const handleAIResult = useCallback((data) => {
    setAiResult(data)
    setAiLoading(false)
    setRightTab("ai")
  }, [])

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
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </button>

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

        {(problem.company_tags || problem.companies)?.map(company => (
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
          <Whiteboard
            problem={problem}
            onAIStart={handleAIStart}
            onAIResult={handleAIResult}
          />
        </div>

        {/* DRAG HANDLE / DIVIDER */}
        <div
          className="w-1.5 flex-shrink-0 bg-[#1e2332] hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab Bar — always visible, tabs highlight when AI result exists */}
          <div className="flex items-center border-b border-[#1e2332] bg-[#121622] flex-shrink-0">
            <button
              onClick={() => setRightTab("compiler")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200
                ${rightTab === "compiler"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
            >
              <Cpu className="w-4 h-4" />
              Compiler
            </button>

            <button
              onClick={() => setRightTab("ai")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 relative
                ${rightTab === "ai"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              AI Tool
              {/* Dot indicator when result is ready */}
              {aiResult && rightTab !== "ai" && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">

            {/* COMPILER TAB */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${rightTab === "compiler" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              <Compiler />
            </div>

            {/* AI TAB */}
            <div className={`absolute inset-0 overflow-y-auto transition-opacity duration-200 ${rightTab === "ai" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              {aiLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <p className="text-sm text-gray-400 animate-pulse">AI is analysing your work…</p>
                </div>
              )}

              {!aiLoading && !aiResult && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <Bot className="w-12 h-12 text-indigo-500/40" />
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Use the <span className="text-indigo-400 font-medium">AI toolbar</span> on the whiteboard<br />
                    to get insights, hints, or pseudocode.
                  </p>
                </div>
              )}

              {!aiLoading && aiResult && (
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <h3 className="font-semibold text-sm tracking-wide bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent uppercase">
                        AI Insights
                      </h3>
                    </div>
                    <button
                      onClick={() => { setAiResult(null); setRightTab("compiler") }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Markdown Content */}
                  <div className="text-sm text-gray-200 leading-relaxed space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-5 mb-3 border-b border-white/10 pb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-indigo-50/90 leading-relaxed font-sans" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1 marker:text-indigo-400" {...props} />,
                        a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-sans transition-colors" target="_blank" rel="noreferrer" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-white tracking-wide" {...props} />,
                        pre: ({ node, ...props }) => (
                          <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0f172a] shadow-lg">
                            <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10">
                              <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                              </div>
                              <span className="ml-3 text-[10px] text-gray-400 font-mono uppercase tracking-wider">Snippet</span>
                            </div>
                            <pre className="p-4 overflow-x-auto custom-scrollbar" {...props} />
                          </div>
                        ),
                        code: ({ node, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <code className="text-[13px] text-indigo-100 font-mono leading-relaxed" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="bg-indigo-900/40 text-indigo-200 px-1.5 py-0.5 rounded text-xs font-mono border border-indigo-500/20" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {aiResult.aiResponse || "No response"}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
