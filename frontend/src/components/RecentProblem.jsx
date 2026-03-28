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
        <div className="bg-white dark:bg-[#0f1b2d] border border-gray-200 dark:border-[#1e2a3a] rounded-2xl p-6">  

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 dark:text-white text-xl font-semibold">Recent Activity</h2>

                <Link
                    to="/problems"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    View Problems
                    <ChevronRight size={16} />
                </Link>
            </div>

            {/* List */}
            <div className="space-y-4">

                {paginatedProblems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm">No problems found</p>
                    </div>
                ) : (
                    paginatedProblems.map((p) => (

                        <div
                            key={p.id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-[#1b2a3c] border border-gray-200 dark:border-[#2a3a4e] rounded-xl px-5 py-4 hover:border-[#3b82f6] dark:hover:border-[#3b82f6] transition"
                        >

                            {/* Left Section */}
                            <div className="flex items-center gap-4">

                                {/* Right Click Badge */}
                                <div className="w-10 h-10 rounded-lg bg-green-900/40 flex items-center justify-center">
                                    <Check className="text-green-400" size={18} />
                                </div>

                                {/* Title + Difficulty */}
                                <div>

                                    <h3 className="text-gray-900 dark:text-white font-medium">
                                        {p.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Difficulty:{" "}
                                        <span className={difficultyColor(p.difficulty)}>
                                            {p.difficulty}
                                        </span>
                                    </p>

                                </div>

                            </div>

                            {/* Right View */}
                            <Link
                                to={`/problem/${p.slug}`}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
                            >
                                View
                            </Link>

                        </div>

                    ))
                )}

            </div>

            {/* Pagination Controls */}
            {problems.length > itemsPerPage && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2a3a4e] flex items-center justify-between">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1b2a3c] border border-gray-200 dark:border-[#2a3a4e] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                        </span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1b2a3c] border border-gray-200 dark:border-[#2a3a4e] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}