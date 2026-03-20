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

        if (difficulty === "easy") return "text-green-400"
        if (difficulty === "medium") return "text-yellow-400"
        if (difficulty === "hard") return "text-red-400"

    }

    return (

        <div className="flex-1 bg-[#121622] border border-[#1e2332] rounded-2xl p-6 flex flex-col h-full">

            {/* Title */}
            <h2 className="text-white text-lg font-bold mb-6">
                Recommended
            </h2>


            {/* Problems */}
            <div className="flex flex-col gap-4 flex-1">

                {problems.map((p) => (

                    <Link
                        key={p.id}
                        to={`/solve/${p.id}`}
                        state={{ problem: p }}
                        className="block hover:translate-x-1 transition flex justify-between items-center"
                    >

                        <h3 className="text-sm font-medium text-gray-300">
                            {p.title}
                        </h3>

                        <p className={`text-xs font-semibold ${difficultyColor(p.difficulty)}`}>
                            {p.difficulty ? p.difficulty.toUpperCase() : "EASY"}
                        </p>

                    </Link>

                ))}

            </div>


            {/* Browse Button */}
            <div className="mt-auto pt-6 border-t border-[#1e2332] text-center">
                <Link
                    to="/problems"
                    className="text-[10px] font-bold tracking-widest text-gray-400 uppercase hover:text-white transition-colors"
                >
                    BROWSE ALL PROBLEMS
                </Link>
            </div>

        </div>

    )
}