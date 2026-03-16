// import Whiteboard from "../components/Whiteboard"
// import Compiler from "../components/Compiler"

// export default function SolveProblem() {
//   return (
//     <div className="flex h-screen w-full">

//       {/* LEFT WHITEBOARD */}
//       <div className="w-1/2 border-r border-gray-300">
//         <Whiteboard />
//       </div>

//       {/* RIGHT COMPILER */}
//       <div className="w-1/2">
//         <Compiler />
//       </div>

//     </div>
//   )
// }
import { useParams, useLocation, Link } from "react-router-dom"
import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

export default function SolveProblem() {

  const { problemId } = useParams()
  const location = useLocation()

  const problem = location.state?.problem

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f1117] text-gray-200">

      {/* TOP BAR */}
      <div className="flex items-center gap-6 px-6 py-3 border-b border-[#1e2332] bg-[#121622]">

        {/* Back button */}
        <Link
          to="/sheets"
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </Link>

        {/* Problem title */}
        <h1 className="font-semibold text-white">
          {problem?.title || "Problem"}
        </h1>

        {/* Difficulty */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded
            ${
              problem?.difficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : problem?.difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
        >
          {problem?.difficulty}
        </span>

        {/* Platform */}
        <span className="text-xs text-gray-400">
          {problem?.platform}
        </span>

        {/* Tags */}
        {problem?.tags && (
          <span className="text-xs text-gray-400">
            {problem.tags.join(", ")}
          </span>
        )}

      </div>

      {/* WORKSPACE */}
      <div className="flex flex-1">

        {/* WHITEBOARD */}
        <div className="w-1/2 border-r border-[#1e2332]">
          <Whiteboard />
        </div>

        {/* COMPILER */}
        <div className="w-1/2">
          <Compiler />
        </div>

      </div>

    </div>
  )
}