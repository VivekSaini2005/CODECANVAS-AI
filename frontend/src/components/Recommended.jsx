import { useEffect, useState } from "react"
import API from "../api/axiosInstance"
import { Link } from "react-router-dom"

export default function RecommendedProblems() {

    const [problems, setProblems] = useState([])

    useEffect(() => {

        const fetchRecommended = async () => {
            try {

                const res = await API.get("/problems/recommended")
                const problemdata = await API.get("/problems")
                setProblems(res.data)

            } catch (err) {
                console.error(err)
            }
        }

        fetchRecommended()

    }, [])


    const difficultyColor = (difficulty) => {
        const lower = difficulty?.toLowerCase();
        if (lower === "easy") return "bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        if (lower === "medium") return "bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400";
        if (lower === "hard") return "bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400";
        return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400";
    }

    return (

        <div className="flex-1 glass border border-gray-200 dark:border-white/5 rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col h-full shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            {/* Title */}
            <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-6">
                Recommended
            </h2>


            {/* Problems */}
            <div className="flex flex-col flex-1 divide-y divide-gray-100 dark:divide-white/5 overflow-y-auto scrollbar-thin">

                {problems.map((p) => (

                    <Link
                        key={p.id}
                        to={`/solve/${p.id}`}
                        state={{ problem: p }}
                        className="flex justify-between items-center py-3.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group"
                    >

                        <h3 className="text-[13px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#625df5] dark:group-hover:text-indigo-400 transition-colors truncate max-w-[70%]">
                            {p.title}
                        </h3>

                        <p className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${difficultyColor(p.difficulty)}`}>
                            {p.difficulty ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase() : "Easy"}
                        </p>

                    </Link>

                ))}

            </div>


            {/* Browse Button */}
            <div className="mt-4 pt-5 border-t border-gray-100 dark:border-white/5 text-center">
                <Link
                    to="/problems"
                    className="inline-block text-[10px] font-bold tracking-widest text-[#625df5] dark:text-indigo-400 uppercase hover:text-[#524de3] hover:scale-105 hover:brightness-110 transition-all duration-200 cursor-pointer opacity-90 hover:opacity-100"
                >
                    BROWSE ALL PROBLEMS
                </Link>
            </div>

        </div>

    )
}