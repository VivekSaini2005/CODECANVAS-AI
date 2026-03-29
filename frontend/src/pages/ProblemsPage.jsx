import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/axiosInstance"
import { CheckCircle, XCircle, Shuffle } from "lucide-react"

export default function ProblemsPage() {
    const navigate = useNavigate()
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

        return matchDifficulty && matchStatus && matchTag && matchCompany
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
    }

    const selectClass = "bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-[13px] outline-none focus:border-[#3b82f6] appearance-none bg-no-repeat bg-[position:right_0.75rem_center] bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] pr-10 min-w-[140px] cursor-pointer hover:border-[#2a3a4e] transition-colors";

    return (
        <div className="p-8 max-w-7xl mx-auto pb-10">
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
            <div className="flex gap-4 mb-6 flex-wrap">
                <select 
                    className={selectClass} 
                    value={selectedDifficulty}
                    onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
                >
                    <option value="Difficulty">Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select 
                    className={selectClass} 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                >
                    <option value="Status">Status</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                </select>

                <select 
                    className={selectClass} 
                    value={selectedTag}
                    onChange={(e) => { setSelectedTag(e.target.value); setPage(1); }}
                >
                    <option value="Topic Tags">Topic Tags</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>

                <select 
                    className={selectClass} 
                    value={selectedCompany}
                    onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
                >
                    <option value="Companies">Companies</option>
                    {allCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                    ))}
                </select>

                <button
                    onClick={resetFilters}
                    className="border border-gray-200 dark:border-[#1e2332] text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg text-[13px] font-medium bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-[#121622] transition-colors gap-2.5 flex items-center ml-auto"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Reset Filters
                </button>
            </div>

            {/* TABLE */}
            <div className="border border-gray-200 dark:border-[#1e2332] rounded-xl overflow-hidden bg-white dark:bg-[#0d111a]">
                <table className="w-full text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                        <tr className="text-left border-b border-gray-200 dark:border-[#1e2332]">
                            <th className="p-[18px] pl-8 w-24">STATUS</th>
                            <th className="p-[18px]">TITLE</th>
                            <th className="p-[18px]">SHEET</th>
                            <th className="p-[18px]">DIFFICULTY</th>
                            <th className="p-[18px]">COMPANIES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProblems.map((p, index) => {
                            const isSolved = solvedIds.has(p.id)
                            const isToggling = toggling === p.id
                            
                            return (
                            <tr key={p.id} className="border-b border-gray-200 dark:border-[#1e2332] last:border-0 hover:bg-gray-50 dark:hover:bg-[#121622] bg-white dark:bg-[#0d111a] transition-colors group">
                                {/* STATUS */}
                                <td className="p-4 pl-10 cursor-pointer" onClick={() => !isToggling && toggleSolved(p.id)}>
                                    {isSolved ? (
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle size={14} className="text-green-500" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#2a3a4e] bg-transparent flex items-center justify-center ml-0.5 group-hover:border-gray-400 transition-colors"></div>
                                    )}
                                </td>

                                {/* TITLE */}
                                <td className="p-4">
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
                                        className={`hover:text-blue-400 font-medium text-[14px] text-left ${isSolved ? 'line-through text-gray-500 hover:text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}
                                    >
                                        {indexOfFirst + index + 1}. {p.title}
                                    </button>
                                </td>

                                {/* SHEET */}
                                <td className="p-4 text-gray-500 dark:text-gray-400 text-[13px]">
                                    {p.sheet || "Blind 75"}
                                </td>

                                {/* DIFFICULTY */}
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${difficultyColor(p.difficulty)}`}>
                                        {p.difficulty ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1) : "Easy"}
                                    </span>
                                </td>

                                {/* ACCEPTANCE */}
                                {/* REMOVED */}

                                {/* COMPANIES */}
                                <td className="p-4 flex gap-1 items-center mt-1">
                                    {p.companies && p.companies.length > 0 ? (
                                        <>
                                            {p.companies.slice(0, 2).map((c, i) => (
                                                <span key={i} className="w-[22px] h-[22px] flex items-center justify-center bg-gray-200 dark:bg-[#1e2332] rounded-full text-[9px] font-bold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-[#2a3a4e]" title={c}>
                                                    {c.charAt(0).toUpperCase()}
                                                </span>
                                            ))}
                                            {p.companies.length > 2 && (
                                                <span className="w-[22px] h-[22px] flex items-center justify-center bg-gray-200 dark:bg-[#1e2332] rounded-full text-[9px] font-bold text-gray-500 ring-1 ring-inset ring-[#2a3a4e]">
                                                    +{p.companies.length - 2}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-600">-</span>
                                    )}
                                </td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-8">
                <div className="text-[13px] text-gray-500 dark:text-gray-400">
                    Showing {filteredProblems.length === 0 ? 0 : indexOfFirst + 1}-{Math.min(indexOfLast, filteredProblems.length)} of {filteredProblems.length} problems
                </div>

                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3.5 py-1.5 border border-gray-200 dark:border-[#1e2332] bg-transparent text-gray-500 dark:text-gray-400 text-[13px] font-medium rounded-lg hover:bg-gray-200 dark:bg-[#1e2332] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className={`min-w-[32px] h-8 px-2 rounded-lg text-[13px] font-medium transition ${page === p ? 'bg-[#3b82f6] text-white shadow-sm shadow-[#3b82f6]/20 border border-[#3b82f6]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:bg-[#1e2332] bg-transparent border border-transparent hover:border-gray-200 dark:border-[#1e2332]'}`}
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
                        className="px-3.5 py-1.5 border border-gray-200 dark:border-[#1e2332] bg-transparent text-gray-500 dark:text-gray-400 text-[13px] font-medium rounded-lg hover:bg-gray-200 dark:bg-[#1e2332] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}