import { useParams, useLocation, Link } from "react-router-dom"
import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

export default function SolveProblem() {

  const { problemId } = useParams()
  const location = useLocation()

  const problem = location.state?.problem
  console.log(problem);

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
        <Link
          to="/sheets"
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </Link>

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

        {problem.company_tags?.map(company => (
          <span
            key={company}
            className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded"
          >
            {company}
          </span>
        ))}

      </div>


      {/* ================= WORKSPACE ================= */}
      <div className="flex flex-1">

        {/* WHITEBOARD */}
        <div className="w-1/2 border-r border-[#1e2332]">
          <Whiteboard problem={problem} />
        </div>

        {/* COMPILER */}
        <div className="w-1/2">
          <Compiler />
        </div>

      </div>

    </div>
  )
}


// import { useParams, useLocation, Link } from "react-router-dom"
// import Whiteboard from "../components/Whiteboard"
// import Compiler from "../components/Compiler"

// export default function SolveProblem() {

//   const { problemId } = useParams()
//   const location = useLocation()

//   const problem = location.state?.problem

//   return (
//     <div className="flex flex-col h-screen w-full bg-[#0f1117] text-gray-200">

//       {/* TOP BAR */}
//       <div className="flex items-center gap-6 px-6 py-3 border-b border-[#1e2332] bg-[#121622]">

//         {/* Back button */}
//         <Link
//           to="/sheets"
//           className="text-gray-400 hover:text-white text-sm"
//         >
//           ← Back
//         </Link>

//         {/* Problem title */}
//         <h1 className="font-semibold text-white">
//           {problem?.title || "Problem"}
//         </h1>

//         {/* Difficulty */}
//         <span
//           className={`text-xs font-semibold px-2 py-1 rounded
//             ${problem?.difficulty === "Easy"
//               ? "bg-green-500/20 text-green-400"
//               : problem?.difficulty === "Medium"
//                 ? "bg-yellow-500/20 text-yellow-400"
//                 : "bg-red-500/20 text-red-400"
//             }`}
//         >
//           {problem?.difficulty}
//         </span>

//         {/* Platform */}
//         <span className="text-xs text-gray-400">
//           {problem?.platform}
//         </span>

//         {/* Tags */}
//         {problem?.tags && (
//           <span className="text-xs text-gray-400">
//             {problem.tags.join(", ")}
//           </span>
//         )}

//       </div>

//       {/* WORKSPACE */}
//       <div className="flex flex-1">

//         {/* WHITEBOARD */}
//         <div className="w-1/2 border-r border-[#1e2332]">
//           <Whiteboard />
//         </div>

//         {/* COMPILER */}
//         <div className="w-1/2">
//           <Compiler />
//         </div>

//       </div>

//     </div>
//   )
// }

