import { useEffect, useState } from "react"
import API from "../api/axiosInstance"
import { Link } from "react-router-dom"
import { ChevronRight, Check } from "lucide-react"

export default function RecentProblems() {

    const [problems, setProblems] = useState([])

    useEffect(() => {

        const fetchRecent = async () => {
            try {

                const res = await API.get("/problems/recent")
                setProblems(res.data)

            } catch (err) {
                console.error(err)
            }
        }

        fetchRecent()

    }, [])

    const difficultyColor = (difficulty) => {

        if (difficulty === "easy") return "text-green-400"
        if (difficulty === "medium") return "text-yellow-400"
        if (difficulty === "hard") return "text-red-400"

    }

    return (
        <div className="bg-[#0f1b2d] border border-[#1e2a3a] rounded-2xl p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-semibold">Recent Activity</h2>

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

                {problems.map((p) => (

                    <div
                        key={p.id}
                        className="flex items-center justify-between bg-[#1b2a3c] border border-[#2a3a4e] rounded-xl px-5 py-4 hover:border-[#3b82f6] transition"
                    >

                        {/* Left Section */}
                        <div className="flex items-center gap-4">

                            {/* Right Click Badge */}
                            <div className="w-10 h-10 rounded-lg bg-green-900/40 flex items-center justify-center">
                                <Check className="text-green-400" size={18} />
                            </div>

                            {/* Title + Difficulty */}
                            <div>

                                <h3 className="text-white font-medium">
                                    {p.title}
                                </h3>

                                <p className="text-sm text-gray-400">
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
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            View
                        </Link>

                    </div>

                ))}

            </div>

        </div>
    )
}