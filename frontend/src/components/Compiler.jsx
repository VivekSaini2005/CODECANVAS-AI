import { useState } from "react"
import Editor from "@monaco-editor/react"

function Compiler() {

  const [code, setCode] = useState("// write code here")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const runCode = async () => {

    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        input,
        language: "cpp"
      })
    })

    const data = await res.json()
    setOutput(data.output)

  }

  return (

    <div className="h-full flex flex-col">

      {/* Code Editor */}
      <div className="h-[60%]">
        <Editor
          height="100%"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={(value)=>setCode(value)}
        />
      </div>

      {/* Input */}
      <textarea
        placeholder="Custom Input"
        className="bg-[#121622] text-white p-3 h-24"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
      />

      {/* Run button */}
      <button
        onClick={runCode}
        className="bg-[#625df5] text-white py-2"
      >
        Run Code
      </button>

      {/* Output */}
      <pre className="bg-black text-green-400 p-3 flex-1">
        {output}
      </pre>

    </div>

  )
}

export default Compiler