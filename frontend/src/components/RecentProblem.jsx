import { useEffect, useState } from "react"
import API from "../api/axiosInstance"
import { Link } from "react-router-dom"
import { ChevronRight, Check, ChevronLeft } from "lucide-react"

export default function RecentProblems() {

    const [problems, setProblems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {

        const fetchRecent = async () => {
            try {

                const res = await API.get("/problems/recent")
                setProblems(res.data)
                setCurrentPage(1) // Reset to first page when fetching new data

            } catch (err) {
                console.error(err)
            }
        }

        fetchRecent()

    }, [])

    const difficultyColor = (difficulty) => {

        if (difficulty === "easy") return "text-green-600 dark:text-green-400"
        if (difficulty === "medium") return "text-yellow-600 dark:text-yellow-400"
        if (difficulty === "hard") return "text-red-600 dark:text-red-400"

    }

    // Calculate pagination
    const totalPages = Math.ceil(problems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedProblems = problems.slice(startIndex, endIndex)

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1))
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1))
    }

    return (
        <div className="glass rounded-2xl p-3 sm:p-4 md:p-6 shadow-soft transition-all duration-200 hover:shadow-lg flex flex-col h-full">  

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 dark:text-white text-lg font-semibold tracking-tight">Recent Activity</h2>

                <Link
                    to="/problems"
                    className="flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer opacity-80 hover:opacity-100 filter hover:brightness-110 group relative"
                >
                    <span className="relative">
                        View Problems
                        <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* List (Timeline Style) */}
            <div className="relative flex flex-col flex-1 pl-2">
                
                {/* Timeline Indicator Line */}
                {paginatedProblems.length > 0 && (
                    <div className="absolute left-2 top-3 bottom-0 w-[1px] bg-gray-200 dark:bg-white/10 z-0"></div>
                )}

                {paginatedProblems.length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center flex-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                            <Check size={24} className="text-gray-400 opacity-80" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No activity yet</p>
                    </div>
                ) : (
                    paginatedProblems.map((p, index) => {
                        let statusColor = "bg-green-500/10 text-green-500 dark:text-green-400";
                        let statusText = "Solved";
                        
                        // Using p.status if defined from API, otherwise defaults to Solved as implied by earlier layout
                        if (p.status === "attempted") {
                            statusColor = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
                            statusText = "Attempted";
                        } else if (p.status === "failed") {
                            statusColor = "bg-red-500/10 text-red-600 dark:text-red-400";
                            statusText = "Failed";
                        }

                        // Parse standard Date time logic if available, else static
                        const timeAgo = p.created_at ? new Date(p.created_at).toLocaleDateString() : "2h ago";

                        return (
                            <div
                                key={p.id}
                                className={`relative flex gap-4 items-start py-3 group transition-all duration-300 ease-out origin-top hover:!opacity-100  ${index !== paginatedProblems.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="mt-3 relative z-10 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)] ring-4 ring-white dark:ring-[#0b0f1a] transition-transform duration-200 group-hover:scale-125 -ml-[3px]"></div>

                                {/* Activity Card */}
                                <Link
                                    to={`/problem/${p.slug}`}
                                    className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-200 group-hover:text-[#625df5] dark:group-hover:text-indigo-400 transition-colors truncate max-w-[70%]">
                                            {p.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{timeAgo}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${statusColor}`}>
                                            {statusText}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${p.difficulty?.toLowerCase() === 'easy' ? 'bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : p.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                            {p.difficulty || 'Easy'}
                                        </span>
                                    </div>
                                </Link>

                            </div>
                        );
                    })
                )}

            </div>

            {/* Pagination Controls */}
            {problems.length > itemsPerPage && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 cursor-pointer opacity-90 hover:opacity-100 hover:shadow-md disabled:hover:scale-100 disabled:hover:shadow-none filter hover:brightness-110"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Page <span className="font-bold text-[#625df5] dark:text-indigo-400">{currentPage}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                        </span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 cursor-pointer opacity-90 hover:opacity-100 hover:shadow-md disabled:hover:scale-100 disabled:hover:shadow-none filter hover:brightness-110 group"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}