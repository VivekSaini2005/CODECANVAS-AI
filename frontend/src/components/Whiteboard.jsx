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
import { Excalidraw } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import { useState } from "react"
import API from "../api/axiosInstance"

export default function Whiteboard({ problem }) {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAction = async (actionType) => {
    try {
      if (!excalidrawAPI) {
        alert("Whiteboard not ready yet!")
        return
      }

      setLoading(true)

      // ✅ Correct way
      const elements = excalidrawAPI.getSceneElements()
      console.log(problem);
      console.log("Elements:", elements)

      const res = await API.post("/ai/analyze", {
        elements,
        problem: problem?.title,
        action: actionType
      })
      console.log(res);
      setResult(res.data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full relative">

      {/* BUTTONS */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button onClick={() => handleAction("analyze")} className="px-3 py-1 bg-indigo-600 rounded text-sm">
          Analyze
        </button>

        <button onClick={() => handleAction("pseudocode")} className="px-3 py-1 bg-green-600 rounded text-sm">
          Pseudocode
        </button>

        <button onClick={() => handleAction("hint")} className="px-3 py-1 bg-yellow-600 rounded text-sm">
          Hint
        </button>
      </div>

      {/* RESULT */}
      {/* {result && (
        <div className="absolute bottom-3 right-3 bg-black p-3 rounded w-72 text-xs">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )} */}
      {result && (
        <div className="absolute bottom-3 right-3 z-50 bg-black p-3 rounded w-80 text-xs overflow-auto max-h-60 text-white shadow-lg">
          
          <p className="text-green-400 mb-2 font-bold">AI Response:</p>

          <pre className="whitespace-pre-wrap font-sans text-sm">
            {result.aiResponse}
          </pre>

        </div>
      )}

      {/* WHITEBOARD */}
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}  // 🔥 THIS IS KEY
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