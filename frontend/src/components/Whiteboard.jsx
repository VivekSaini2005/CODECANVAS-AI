// import { Excalidraw } from "@excalidraw/excalidraw"
// import "@excalidraw/excalidraw/index.css"

// export default function Whiteboard() {
//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <Excalidraw
//         UIOptions={{
//           canvasActions: {
//             loadScene: false,
//             saveToActiveFile: false,
//             export: false,
//             saveAsImage: false
//           }
//         }}
//       />
//     </div>
//   )
// }
// import { Tldraw } from "tldraw"
// import "tldraw/tldraw.css"

// export default function Whiteboard() {
//   return (
//     <div className="relative w-full h-full">

//       <Tldraw
//         autoFocus
//         inferDarkMode
//         className="absolute inset-0"
//       />

//     </div>
//   )
// }

import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import { useState } from "react"
import API from "../api/axiosInstance"
import { Sparkles, Code, Lightbulb, X, Loader2, Bot, Sun, Moon, GripHorizontal } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { useRef } from "react"

export default function Whiteboard({ problem }) {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const [result, setResult] = useState(null)
  const [theme, setTheme] = useState("dark")

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    isDragging.current = true
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    e.target.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (isDragging.current) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      })
    }
  }

  const handlePointerUp = (e) => {
    isDragging.current = false
    e.target.releasePointerCapture(e.pointerId)
  }

  const handleAction = async (actionType) => {
    try {
      if (!excalidrawAPI) {
        alert("Whiteboard not ready!")
        return
      }

      setLoading(true)
      setCurrentAction(actionType)

      // 🔥 EXPORT IMAGE FROM CANVAS
      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements(),
        appState: excalidrawAPI.getAppState(),
        mimeType: "image/png"
      })

      const formData = new FormData()
      formData.append("image", blob, "whiteboard.png")
      formData.append("problem", problem?.title || "")
      formData.append("action", actionType)

      const res = await API.post("/ai/analyze-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (res.data && res.data.aiResponse) {
        res.data.aiResponse = String(res.data.aiResponse).replace(/\\n/g, '\n').replace(/\\t/g, '\t')
      }

      setResult(res.data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setCurrentAction(null)
    }
  }

  return (
    <div className="h-full w-full relative">

      {/* AI TOOLBAR - Modern Glassmorphic Pill */}
      <div 
        className="absolute bottom-16 left-1/2 z-[100] flex gap-3 p-2 bg-gradient-to-b from-[#1e293b]/90 to-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto items-center hover:border-white/20 transition-colors"
        style={{ transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)` }}
      >
        
        {/* DRAG HANDLE */}
        <div 
          className="pl-2 pr-3 border-r border-white/10 mr-1 flex items-center cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <GripHorizontal className="w-5 h-5 text-gray-400 hover:text-white transition-colors pointer-events-none" />
          <Bot className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] ml-2 pointer-events-none hidden sm:block" />
        </div>

        <button 
          onClick={() => handleAction("analyze")} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/30 hover:border-indigo-400 text-indigo-100 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          {loading && currentAction === "analyze" ? <Loader2 className="w-4 h-4 animate-spin text-indigo-200" /> : <Sparkles className="w-4 h-4 text-indigo-300" />}
          <span>Analyze</span>
        </button>

        <button 
          onClick={() => handleAction("pseudocode")} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-500/30 hover:border-emerald-400 text-emerald-100 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          {loading && currentAction === "pseudocode" ? <Loader2 className="w-4 h-4 animate-spin text-emerald-200" /> : <Code className="w-4 h-4 text-emerald-300" />}
          <span>Pseudocode</span>
        </button>

        <button 
          onClick={() => handleAction("hint")} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 border border-amber-500/30 hover:border-amber-400 text-amber-100 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          {loading && currentAction === "hint" ? <Loader2 className="w-4 h-4 animate-spin text-amber-200" /> : <Lightbulb className="w-4 h-4 text-amber-300" />}
          <span>Hint</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
        
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-indigo-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* RESULT MODAL / PANEL */}
      {result && (
        <div className="absolute bottom-24 right-4 z-[100] w-96 flex flex-col p-5 bg-[#0f172a]/95 backdrop-blur-2xl border border-indigo-500/40 text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(79,70,229,0.15)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <h3 className="font-semibold text-sm tracking-wide bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent uppercase">AI Insights</h3>
            </div>
            <button 
              onClick={() => setResult(null)} 
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto w-full max-h-[60vh] custom-scrollbar text-sm text-gray-200 leading-relaxed space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mt-5 mb-3 border-b border-white/10 pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-3 text-indigo-50/90 leading-relaxed font-sans" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                li: ({node, ...props}) => <li className="pl-1 marker:text-indigo-400" {...props} />,
                a: ({node, ...props}) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-sans transition-colors" target="_blank" rel="noreferrer" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white tracking-wide" {...props} />,
                pre: ({node, ...props}) => (
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
                code: ({node, className, children, ...props}) => {
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
              {result.aiResponse || "No response"}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* WHITEBOARD */}
      <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} 
        theme={theme}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            export: false,
            saveAsImage: false
          }
        }}
      />
    </div>
  )
}