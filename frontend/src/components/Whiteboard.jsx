import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import { useState } from "react"
import API from "../api/axiosInstance"
import { Sparkles, Code, Lightbulb, Loader2, Bot, Sun, Moon, GripHorizontal } from "lucide-react"
import { useRef } from "react"
import { useTheme } from "../context/ThemeContext"

export default function Whiteboard({ problem, onAIStart, onAIResult }) {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const { theme, toggleTheme } = useTheme()

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

      // Notify parent that AI work has started
      if (onAIStart) onAIStart()

      const allElements = excalidrawAPI.getSceneElements()
      const visibleElements = allElements.filter(el => !el.isDeleted)
      const isBoardEmpty = visibleElements.length === 0

      if (isBoardEmpty) {
        if (actionType === "analyze") {
          if (onAIResult) onAIResult({ success: false, aiResponse: "Board has no image", action: "analyze" })
          setLoading(false)
          setCurrentAction(null)
          return
        } else {
          // For hint or pseudocode with empty board, just do a text request
          const userMsg = actionType === "hint" 
            ? "Can you give me a hint based on question?" 
            : "Can you generate pseudocode based on my question?";
            
          const res = await API.post("/ai/chat-continue", {
             chatHistory: [],
             message: userMsg,
             problem: problem?.title || ""
          })
          
          if (res.data && res.data.aiResponse) {
            res.data.aiResponse = String(res.data.aiResponse).replace(/\\n/g, '\n').replace(/\\t/g, '\t')
          }
          
          if (onAIResult) onAIResult({ ...res.data, action: actionType })
          setLoading(false)
          setCurrentAction(null)
          return
        }
      }

      // Export image from canvas (only if NOT empty)
      const blob = await exportToBlob({
        elements: allElements,
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

      // Pass result to parent
      if (onAIResult) onAIResult({ ...res.data, action: actionType })

    } catch (err) {
      console.error(err)
      // Even on error, tell parent loading is done with null
      if (onAIResult) onAIResult(null)
    } finally {
      setLoading(false)
      setCurrentAction(null)
    }
  }

  return (
    <div className="h-full w-full relative">

      {/* AI TOOLBAR - Modern Glassmorphic Pill */}
      <div
        className="absolute bottom-16 left-1/2 z-[100] flex gap-3 p-2 bg-gradient-to-b from-[#1e293b]/90 to-[#0f172a]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl pointer-events-auto items-center hover:border-white/20 transition-colors"
        style={{ transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)` }}
      >

        {/* DRAG HANDLE */}
        <div
          className="pl-2 pr-3 border-r border-gray-200 dark:border-white/10 mr-1 flex items-center cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <GripHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-white transition-colors pointer-events-none" />
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
          onClick={toggleTheme}
          className="p-2 text-indigo-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

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