import { useEffect, useState, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import API from "../api/axiosInstance"
import { CheckCircle2, Circle, ExternalLink, ArrowLeft } from "lucide-react"

function SheetProblems() {
  const { id } = useParams()

  const [problems, setProblems] = useState([])
  const [solvedIds, setSolvedIds] = useState(new Set())
  const [sheetName, setSheetName] = useState("")
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null) // problem id being toggled

  // ─── Fetch problems + solved IDs ────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        // Fetch sheet problems
        const [problemsRes, progressRes] = await Promise.all([
          API.get(`/sheets/${id}`),
          API.get("/progress")
        ])
        // console.log(problemsRes.data)

        setProblems(problemsRes.data)

        // Build Set of solved problem IDs
        const ids = new Set(
          progressRes.data.map(r => r.problem_id).filter(Boolean)
        )
        setSolvedIds(ids)

        // Try to get sheet name from the list endpoint
        const sheetsRes = await API.get("/sheets")
        const sheet = sheetsRes.data.find(s => String(s.id) === String(id))
        if (sheet) setSheetName(sheet.name)
      } catch (err) {
        console.error("Failed to load sheet problems", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  // ─── Toggle solved status ────────────────────────────────────────────────────
  const toggleSolved = useCallback(async (problemId) => {
    setToggling(problemId)
    try {
      const res = await API.post("/progress", { problemId })
      const { solved } = res.data

      setSolvedIds(prev => {
        const next = new Set(prev)
        if (solved) next.add(problemId)
        else next.delete(problemId)
        return next
      })
    } catch (err) {
      console.error("Failed to update progress", err)
    } finally {
      setToggling(null)
    }
  }, [])

  // ─── Derived stats ───────────────────────────────────────────────────────────
  const total = problems.length
  const solved = problems.filter(p => solvedIds.has(p.id)).length
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0

  const difficultyStyle = {
    Easy: { bg: "bg-[#10b981]/10", text: "text-[#10b981]" },
    Medium: { bg: "bg-[#f59e0b]/10", text: "text-[#f59e0b]" },
    Hard: { bg: "bg-[#ef4444]/10", text: "text-[#ef4444]" },
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Link
          to="/sheets"
          className="w-8 h-8 rounded-lg bg-[#1e2332] hover:bg-[#252b3d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {sheetName || "Sheet Problems"}
          </h1>
          {!loading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {solved} of {total} problems solved
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!loading && total > 0 && (
        <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">Overall Progress</span>
            <span
              className="text-sm font-bold"
              style={{ color: pct === 100 ? "#10b981" : pct >= 50 ? "#625df5" : "#f59e0b" }}
            >
              {pct}%
            </span>
          </div>
          <div className="w-full bg-[#1a1f2e] rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: pct === 100 ? "#10b981" : pct >= 50 ? "#625df5" : "#f59e0b"
              }}
            />
          </div>
          {/* Difficulty breakdown */}
          <div className="flex gap-4 mt-4 text-xs text-gray-500 font-semibold">
            {["Easy", "Medium", "Hard"].map(d => {
              const count = problems.filter(p => p.difficulty === d).length
              const style = difficultyStyle[d]
              return (
                <span
                  key={d}
                  className={`px-2 py-0.5 rounded ${style.bg} ${style.text}`}
                >
                  {d}: {count}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Problems Table */}
      <div className="bg-[#121622] border border-[#1e2332] rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-[2.5rem_1fr_6rem_7rem_2.5rem] gap-x-4 px-5 py-3 border-b border-[#1e2332]">
          <span />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Problem</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Difficulty</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Platform</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            Loading…
          </div>
        ) : problems.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            No problems in this sheet yet.
          </div>
        ) : (
          problems.map((p, idx) => {
            const isSolved = solvedIds.has(p.id)
            const isToggling = toggling === p.id
            const diff = difficultyStyle[p.difficulty] ?? { bg: "bg-gray-700/20", text: "text-gray-400" }

            return (
              <div
                key={p.id}
                className={`
                  grid grid-cols-[2.5rem_1fr_6rem_7rem_2.5rem] gap-x-4 px-5 py-4
                  items-center transition-colors duration-200
                  ${idx !== problems.length - 1 ? "border-b border-[#1e2332]" : ""}
                  ${isSolved ? "bg-[#10b981]/5" : "hover:bg-[#1e2332]/50"}
                `}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSolved(p.id)}
                  disabled={isToggling}
                  className="flex items-center justify-center text-gray-500 hover:text-[#625df5] transition-colors disabled:opacity-50"
                  title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                >
                  {isSolved
                    ? <CheckCircle2 size={20} className="text-[#10b981]" />
                    : <Circle size={20} />
                  }
                </button>

                {/* Title */}
                {/* <span
                  className={`text-sm font-medium transition-colors ${
                    isSolved ? "line-through text-gray-500" : "text-gray-200"
                  }`}
                >
                  {p.title}
                </span> */}
                {/* <Link
                  to={`/solve/${p.id}`}
                  className={`text-sm font-medium hover:text-[#625df5] ${
                    isSolved ? "line-through text-gray-500" : "text-gray-200"
                  }`}
                >
                  {p.title}
                </Link> */}
                <Link
                  to={`/solve/${p.id}`}
                  state={{ problem: p }}
                  className={`text-sm font-medium hover:text-[#625df5] ${isSolved ? "line-through text-gray-500" : "text-gray-200"
                    }`}
                >
                  {p.title}
                </Link>

                {/* Difficulty */}
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded w-fit ${diff.bg} ${diff.text}`}>
                  {p.difficulty}
                </span>

                {/* Platform */}
                <span className="text-xs text-gray-400 font-medium truncate">
                  {p.platform}
                </span>

                {/* External link */}
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#625df5] transition-colors flex items-center justify-center"
                  >
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <span />
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default SheetProblems