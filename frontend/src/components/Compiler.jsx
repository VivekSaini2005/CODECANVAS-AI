import { useState } from "react"
import Editor from "@monaco-editor/react"
import API from "../api/axiosInstance"
import { useTheme } from "../context/ThemeContext"

const LANGUAGES = {
  cpp: { id: 54, label: "C++" },
  python: { id: 71, label: "Python" },
  java: { id: 62, label: "Java" },
  javascript: { id: 63, label: "JavaScript" }
}

function Compiler() {

  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState("// Write your code here")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()

  const runCode = async () => {

    try {

      setLoading(true)
      setOutput("Running...")
      // console.log(code);
      // console.log(input);
      const res = await API.post("/run/coderun", {
        code,
        input,
        language_id: LANGUAGES[language].id
      })

      const data = res.data
      // console.log(data);
      setOutput(data.output || "Execution completed with no output")

    } catch (err) {
      setOutput("Error running code: " + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="flex flex-col h-full bg-white dark:bg-[#0f1117]">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-[#1e2332]">

        {/* Language selector */}
        <select
          value={language}
          onChange={(e)=>setLanguage(e.target.value)}
          className="bg-gray-100 dark:bg-[#1e2332] text-gray-900 dark:text-white px-3 py-1 rounded text-sm"
        >
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <option key={key} value={key}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* Run button */}
        <button
          onClick={runCode}
          disabled={loading}
          className="bg-[#625df5] hover:bg-[#7c77ff] text-white px-4 py-1 rounded text-sm"
        >
          {loading ? "Running..." : "Run"}
        </button>

      </div>

      {/* EDITOR */}
      <div className="flex-1">

        <Editor
          height="100%"
          language={language}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={(value)=>setCode(value)}
        />

      </div>

      {/* I/O WRAPPER */}
      <div className={`flex flex-col border-t border-gray-200 dark:border-[#1e2332] bg-white dark:bg-[#0f1117] ${output ? 'h-[250px]' : ''} flex-shrink-0`}>
        
        {/* INPUT */}
        <div className={`p-3 flex flex-col ${output ? 'h-[100px]' : ''} flex-shrink-0`}>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Input
          </div>
          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            className={`w-full bg-gray-100 dark:bg-[#121622] text-gray-900 dark:text-white p-2 rounded text-sm ${output ? 'flex-1 resize-none' : 'h-20'}`}
            placeholder="Enter input..."
          />
        </div>

        {/* OUTPUT (Conditional) */}
        {output && (
          <div className="border-t border-gray-200 dark:border-[#1e2332] p-3 flex-1 flex flex-col overflow-hidden">
            <div className="text-xs flex justify-between text-gray-500 dark:text-gray-400 mb-1">
              <span>Output</span>
              <button onClick={() => setOutput("")} className="hover:text-white transition-colors">Clear</button>
            </div>
            <pre className="bg-gray-100 dark:bg-black text-green-600 dark:text-green-400 p-3 rounded text-sm overflow-auto flex-1 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}

      </div>

    </div>

  )
}

export default Compiler