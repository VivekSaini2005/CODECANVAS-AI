import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useRef, useState, useCallback, useEffect } from "react"
import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Bot, X, Code2, Cpu, Send, Loader2 } from "lucide-react"
import API from "../api/axiosInstance"

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

  // Chat continuation states
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [currentActionContext, setCurrentActionContext] = useState(null)

  // Right panel active tab: "compiler" | "ai"
  const [rightTab, setRightTab] = useState("compiler")

  // Called by Whiteboard when an AI action starts
  const handleAIStart = useCallback(() => {
    setAiLoading(true)
    setRightTab("ai")
  }, [])

  // Called by Whiteboard when an AI result arrives
  const handleAIResult = useCallback((data) => {
    if (data && (data.action === "hint" || data.action === "pseudocode")) {
      const initialPrompt = data.action === "hint" 
         ? "Can you give me a hint based on question?" 
         : "Can you generate pseudocode based on my question?";
      setChatHistory([
        { role: "user", text: initialPrompt },
        { role: "model", text: data.aiResponse }
      ]);
      setCurrentActionContext(data.action);
    } else {
      setChatHistory([]);
      setCurrentActionContext(null);
    }
    setAiResult(data)
    setAiLoading(false)
    setRightTab("ai")
  }, [])

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput("");
    
    // Optimistically update UI
    const updatedHistory = [...chatHistory, { role: "user", text: userMsg }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const historyToSend = chatHistory.map(msg => ({ role: msg.role, text: msg.text }));
      
      const res = await API.post("/ai/chat-continue", {
         chatHistory: historyToSend,
         message: userMsg,
         problem: problem?.title || ""
      });

      if (res.data && res.data.success) {
         let newResponse = String(res.data.aiResponse).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
         setChatHistory([
           ...updatedHistory,
           { role: "model", text: newResponse }
         ]);
      } else {
         throw new Error("Failed to get response");
      }
    } catch (err) {
      console.error(err);
      setChatHistory([
        ...updatedHistory,
        { role: "model", text: "Sorry, I encountered an error while processing your request." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }

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
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Problem data not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-gray-200">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 px-3 sm:px-6 py-3 border-b border-gray-200 dark:border-[#1e2332] bg-white dark:bg-[#121622] flex-wrap">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 dark:text-gray-400 hover:text-indigo-400 text-sm shrink-0" 
        >
          <span className="sm:hidden text-lg">←</span>
          <span className="hidden sm:inline">← Back</span>
        </button>

        {/* Title */}
        <h1 className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none shrink-0">
          {problem.title}
        </h1>

        {/* Difficulty */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded shrink-0
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
        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 hidden sm:inline-block">
          {problem.platform}
        </span>

        {/* Spacer */}
        <div className="flex-1 min-w-[20px]"></div>

        {/* Original Problem */}
        {problem.link && (
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline shrink-0"
          >
            <span className="hidden sm:inline">Original Problem →</span>
            <span className="sm:hidden">Solve →</span>
          </a>
        )}

      </div>


      {/* ================= TAGS + COMPANIES ================= */}
      <div className="px-3 sm:px-6 py-2 border-b border-gray-200 dark:border-[#1e2332] flex flex-wrap gap-2">

        {problem.tags?.map(tag => (
          <span
            key={tag}
            className="text-xs bg-gray-100 dark:bg-[#1c2233] px-2 py-1 rounded" 
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
      <div ref={containerRef} className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden select-none">

        {/* WHITEBOARD */}
        <div className="border-r border-gray-200 dark:border-[#1e2332] flex flex-col overflow-hidden" style={{ width: `${leftWidth}%` }}>
          <Whiteboard
            problem={problem}
            onAIStart={handleAIStart}
            onAIResult={handleAIResult}
          />
        </div>

        {/* DRAG HANDLE / DIVIDER */}
        <div
          className="w-1.5 flex-shrink-0 bg-gray-200 dark:bg-[#1e2332] hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[500px] lg:min-h-0">

          {/* Tab Bar — always visible, tabs highlight when AI result exists */}
          <div className="flex items-center border-b border-gray-200 dark:border-[#1e2332] bg-white dark:bg-[#121622] flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setRightTab("compiler")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200
                ${rightTab === "compiler"
                  ? "border-indigo-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-200 hover:border-gray-600"
                }`}
            >
              <Cpu className="w-4 h-4" />
              Compiler
            </button>

            <button
              onClick={() => setRightTab("ai")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 relative
                ${rightTab === "ai"
                  ? "border-indigo-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-200 hover:border-gray-600"
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
            <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${rightTab === "ai" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              {aiLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">AI is analysing your work…</p>
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
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <h3 className="font-semibold text-sm tracking-wide bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent uppercase">
                        AI Insights {currentActionContext ? `- ${currentActionContext}` : ''}
                      </h3>
                    </div>
                    <button
                      onClick={() => { setAiResult(null); setChatHistory([]); setCurrentActionContext(null); setRightTab("compiler") }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {chatHistory.length > 0 ? (
                      <div className="space-y-6">
                        {chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div className={`text-sm leading-relaxed ${msg.role === "user" ? "bg-indigo-600/20 text-indigo-100 px-4 py-2 rounded-2xl rounded-tr-sm border border-indigo-500/30 max-w-[85%]" : "text-gray-900 dark:text-gray-200 w-full"}`}>
                              {msg.role === "user" ? (
                                msg.text
                              ) : (
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-5 mb-3" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-3 border-b border-gray-200 dark:border-white/10 pb-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-3 text-indigo-50/90 leading-relaxed font-sans" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1 marker:text-indigo-400" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-sans transition-colors" target="_blank" rel="noreferrer" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white tracking-wide" {...props} />,
                                    pre: ({ node, ...props }) => (
                                      <div className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-lg">
                                        <div className="flex items-center px-4 py-2 bg-white/5 border-b border-gray-200 dark:border-white/10">
                                          <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                          </div>
                                          <span className="ml-3 text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">Snippet</span>
                                        </div>
                                        <pre className="p-4 overflow-x-auto custom-scrollbar" {...props} />
                                      </div>
                                    ),
                                    code: ({ node, className, children, ...props }) => {
                                      const match = /language-(\w+)/.exec(className || '')
                                      return match ? (
                                        <code className="text-[13px] text-indigo-100 font-mono leading-relaxed" {...props}>{children}</code>
                                      ) : (
                                        <code className="bg-indigo-900/40 text-indigo-200 px-1.5 py-0.5 rounded text-xs font-mono border border-indigo-500/20" {...props}>{children}</code>
                                      )
                                    }
                                  }}
                                >
                                  {msg.text}
                                </ReactMarkdown>
                              )}
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex items-start">
                            <div className="flex gap-1 px-4 py-3 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/5 rounded-2xl rounded-tl-sm w-fit items-center">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 dark:text-gray-200 leading-relaxed space-y-4">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-5 mb-3" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-3 border-b border-gray-200 dark:border-white/10 pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-3 text-indigo-50/90 leading-relaxed font-sans" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1 font-sans text-indigo-100/90" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-1 marker:text-indigo-400" {...props} />,
                            a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-sans transition-colors" target="_blank" rel="noreferrer" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white tracking-wide" {...props} />,
                            pre: ({ node, ...props }) => (
                              <div className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-lg">
                                <div className="flex items-center px-4 py-2 bg-white/5 border-b border-gray-200 dark:border-white/10">
                                  <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                  </div>
                                  <span className="ml-3 text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">Snippet</span>
                                </div>
                                <pre className="p-4 overflow-x-auto custom-scrollbar" {...props} />
                              </div>
                            ),
                            code: ({ node, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '')
                              return match ? (
                                <code className="text-[13px] text-indigo-100 font-mono leading-relaxed" {...props}>{children}</code>
                              ) : (
                                <code className="bg-indigo-900/40 text-indigo-200 px-1.5 py-0.5 rounded text-xs font-mono border border-indigo-500/20" {...props}>{children}</code>
                              )
                            }
                          }}
                        >
                          {aiResult.aiResponse || "No response"}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Chat Input for Hint & Pseudocode */}
                  {chatHistory.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#121622] shrink-0">
                      <div className="relative flex items-center bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendChat();
                          }}
                          placeholder="Ask a follow-up question..."
                          className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 outline-none"
                          disabled={isChatLoading}
                        />
                        <button
                          onClick={handleSendChat}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="p-2 mr-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
