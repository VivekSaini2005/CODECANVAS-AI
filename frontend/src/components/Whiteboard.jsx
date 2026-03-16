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
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"

export default function Whiteboard() {
  return (
    <div className="relative w-full h-full">

      <Tldraw
        autoFocus
        inferDarkMode
        className="absolute inset-0"
      />

    </div>
  )
}