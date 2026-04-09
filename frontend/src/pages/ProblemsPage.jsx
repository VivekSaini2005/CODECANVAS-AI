import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import API from "../api/axiosInstance"
import { CheckCircle, XCircle, Shuffle, Search } from "lucide-react"

export default function ProblemsPage() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get("search") || ""
    const [problems, setProblems] = useState([])
    const [solvedIds, setSolvedIds] = useState(new Set())
    const [toggling, setToggling] = useState(null)
    const [page, setPage] = useState(1)
    
    // Filters state
    const [selectedDifficulty, setSelectedDifficulty] = useState("Difficulty")
    const [selectedStatus, setSelectedStatus] = useState("Status")
    const [selectedTag, setSelectedTag] = useState("Topic Tags")
    const [selectedCompany, setSelectedCompany] = useState("Companies")

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch problems and progress
                const token = localStorage.getItem("token");
                const progressPromise = token ? API.get("/progress").catch(() => ({ data: [] })) : Promise.resolve({ data: [] });
                
                const [problemsRes, progressRes] = await Promise.all([
                    API.get(`/problems`),
                    progressPromise
                ])
                setProblems(problemsRes.data)

                const ids = new Set(
                    progressRes.data.map(r => r.problem_id).filter(Boolean)
                )
                setSolvedIds(ids)
            } catch (err) {
                console.error(err)
            }
        }
        fetchAll()
    }, [])

    const toggleSolved = async (problemId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("First login then continue");
            navigate("/login");
            return;
        }

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
    }

    const difficultyColor = (difficulty) => {
        if (!difficulty) return "bg-gray-100 dark:bg-[#1e2332] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a4e]";
        const lower = difficulty.toLowerCase()
        if (lower === "easy") return "bg-green-50 dark:bg-[#112a22] text-green-600 dark:text-[#10b981] border border-green-200 dark:border-[#10b981]/20"
        if (lower === "medium") return "bg-yellow-50 dark:bg-[#3f3115] text-yellow-600 dark:text-[#f59e0b] border border-yellow-200 dark:border-[#f59e0b]/20"
        if (lower === "hard") return "bg-red-50 dark:bg-[#3b1c1c] text-red-600 dark:text-[#ef4444] border border-red-200 dark:border-[#ef4444]/20"
        return "bg-gray-100 dark:bg-[#1e2332] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a4e]"
    }

    // Compute unique tags and companies from all problems
    const allTags = Array.from(new Set(problems.flatMap(p => p.tags || []))).sort()
    const allCompanies = Array.from(new Set(problems.flatMap(p => p.companies || []))).sort()

    // Filter problems
    const filteredProblems = problems.filter(p => {
        const matchSearch = !searchQuery || 
            (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchDifficulty = selectedDifficulty === "Difficulty" || 
            (p.difficulty && p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase())
        
        const isSolved = solvedIds.has(p.id)
        const matchStatus = selectedStatus === "Status" || 
            (selectedStatus === "Solved" && isSolved) || 
            (selectedStatus === "Unsolved" && !isSolved)
            
        const matchTag = selectedTag === "Topic Tags" || 
            (p.tags && p.tags.includes(selectedTag))
            
        const matchCompany = selectedCompany === "Companies" || 
            (p.companies && p.companies.includes(selectedCompany))

        return matchSearch && matchDifficulty && matchStatus && matchTag && matchCompany
    })

    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const indexOfLast = page * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentProblems = filteredProblems.slice(indexOfFirst, indexOfLast);

    const resetFilters = () => {
        setSelectedDifficulty("Difficulty")
        setSelectedStatus("Status")
        setSelectedTag("Topic Tags")
        setSelectedCompany("Companies")
        setPage(1)
        if (searchQuery) setSearchParams({})
    }

    const selectClass = "bg-gray-100 dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none bg-no-repeat bg-[position:right_0.75rem_center] bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] pr-10 min-w-[140px] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1e2332] transition-all duration-300";
    const optionClass = "bg-white dark:bg-[#121622] text-gray-900 dark:text-gray-200";

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Explore Problems</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-[13px]">
                        Master your skills with curated coding challenges.
                    </p>
                </div>
                <button className="bg-[#3b82f6] px-5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-blue-500 transition-colors flex items-center gap-2.5 shadow-sm shadow-[#3b82f6]/20">
                    <Shuffle size={16} strokeWidth={2.5} /> Pick One
                </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <select 
                    className={selectClass} 
                    value={selectedDifficulty}
                    onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
                >
                    <option className={optionClass} value="Difficulty">Difficulty</option>
                    <option className={optionClass} value="Easy">Easy</option>
                    <option className={optionClass} value="Medium">Medium</option>
                    <option className={optionClass} value="Hard">Hard</option>
                </select>

                <select 
                    className={selectClass} 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                >
                    <option className={optionClass} value="Status">Status</option>
                    <option className={optionClass} value="Solved">Solved</option>
                    <option className={optionClass} value="Unsolved">Unsolved</option>
                </select>

                <select 
                    className={selectClass} 
                    value={selectedTag}
                    onChange={(e) => { setSelectedTag(e.target.value); setPage(1); }}
                >
                    <option className={optionClass} value="Topic Tags">Topic Tags</option>
                    {allTags.map(tag => (
                        <option className={optionClass} key={tag} value={tag}>{tag}</option>
                    ))}
                </select>

                <select 
                    className={selectClass} 
                    value={selectedCompany}
                    onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
                >
                    <option className={optionClass} value="Companies">Companies</option>
                    {allCompanies.map(company => (
                        <option className={optionClass} key={company} value={company}>{company}</option>
                    ))}
                </select>

                <button
                    onClick={resetFilters}
                    className="border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300 gap-2 flex items-center ml-auto"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Reset Filters
                </button>
            </div>

            {/* TABLE */}
            <div className="border border-gray-200 dark:border-[#1e2332] rounded-xl overflow-hidden bg-white dark:bg-[#0d111a]">
                <div className="w-full overflow-x-auto"><table className="w-full text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                        <tr className="text-left border-b border-gray-200 dark:border-[#1e2332]">
                            <th className="px-3 sm:px-6 py-3 sm:py-4 w-16 sm:w-24 text-center">STATUS</th>      
                            <th className="px-3 sm:px-6 py-3 sm:py-4">TITLE</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4">SHEET</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4">DIFFICULTY</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">COMPANIES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProblems.map((p, index) => {
                            const isSolved = solvedIds.has(p.id)
                            const isToggling = toggling === p.id
                            
                            return (
                            <tr key={p.id} className="border-b border-gray-200 dark:border-[#1e2332] last:border-0 hover:bg-gray-50 dark:hover:bg-[#121622] bg-white dark:bg-[#0d111a] transition-colors group">
                                {/* STATUS */}
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center cursor-pointer" onClick={() => !isToggling && toggleSolved(p.id)}>
                                    <div className="flex justify-center items-center">
                                    {isSolved ? (
                                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:scale-110 transition-all duration-300">
                                            <CheckCircle size={14} className="text-white" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center bg-transparent group-hover:border-gray-400 dark:group-hover:border-white/40 hover:scale-110 transition-all duration-300"></div>
                                    )}
                                    </div>
                                </td>

                                {/* TITLE */}
                                <td className="px-3 sm:px-6 py-3 sm:py-4 max-w-[160px] sm:max-w-[200px] md:max-w-none">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const token = localStorage.getItem("token");
                                            if (!token) {
                                                alert("First login then continue");
                                                navigate("/login");
                                                return;
                                            }
                                            navigate(`/solve/${p.id}`, { state: { problem: p } });
                                        }}
                                        className={`font-medium text-sm leading-relaxed text-left transition-colors duration-200 block truncate w-full ${isSolved ? 'line-through text-gray-500 dark:text-gray-500 hover:text-indigo-400' : 'text-gray-900 dark:text-white/90 hover:text-indigo-400'}`}
                                    >
                                        {indexOfFirst + index + 1}. {p.title}
                                    </button>
                                </td>

                                {/* SHEET */}
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-500 dark:text-gray-400 text-[13px] whitespace-nowrap">
                                    {p.sheet || "Blind 75"}
                                </td>

                                {/* DIFFICULTY */}
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-300 ${
                                        p.difficulty?.toLowerCase() === 'easy' 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                                            : p.difficulty?.toLowerCase() === 'medium'
                                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                                            : p.difficulty?.toLowerCase() === 'hard'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                            : 'bg-green-500/10 text-green-400 border-green-500/20 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]' // fallback easy
                                    }`}>
                                        {p.difficulty ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1) : "Easy"}
                                    </span>
                                </td>

                                {/* ACCEPTANCE */}
                                {/* REMOVED */}

                                {/* COMPANIES */}
                                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                  <div className="flex gap-1 flex-wrap items-center mt-1">
                                    {p.companies && p.companies.length > 0 ? (
                                        <>
                                            {p.companies.slice(0, 2).map((c, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-default" title={c}>
                                                    {c}
                                                </span>
                                            ))}
                                            {p.companies.length > 2 && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors cursor-default">
                                                    +{p.companies.length - 2}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-600">-</span>
                                    )}
                                  </div>
                                </td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table></div>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col items-center mt-8">
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-105 text-gray-700 dark:text-gray-300 text-[13px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Previous
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                            return (
                                <button 
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`min-w-[32px] px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all duration-300 ${page === p ? 'bg-indigo-500 text-white border-indigo-500 hover:scale-105' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-105'}`}
                                >
                                    {p}
                                </button>
                            );
                        } else if (p === page - 2 || p === page + 2) {
                            return <span key={p} className="w-5 text-center text-gray-500 text-[13px] tracking-widest">...</span>;
                        }
                        return null;
                    })}

                    <button 
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages || totalPages === 0}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-105 text-gray-700 dark:text-gray-300 text-[13px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Next
                    </button>
                </div>

                <div className="text-xs text-gray-500 mt-4 font-medium tracking-wide">
                    Showing {filteredProblems.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, filteredProblems.length)} of {filteredProblems.length} results
                </div>
            </div>
        </div>
    )
}