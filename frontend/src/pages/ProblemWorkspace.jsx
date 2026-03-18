import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axiosInstance"

import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

function ProblemWorkspace() {

  const { slug } = useParams()

  const [problem, setProblem] = useState(null)
  const [tags, setTags] = useState([])
  const [companies, setCompanies] = useState([])
  const [link, setLink] = useState("")

  useEffect(() => {

    const fetchProblem = async () => {

      const res = await API.get(`/problems/${slug}`)

      setProblem(res.data.problem)
      setTags(res.data.tags)
      setCompanies(res.data.companies)
      setLink(res.data.link)

    }

    fetchProblem()

  }, [slug])


  if (!problem) return <div className="text-white p-10">Loading...</div>


  return (

    <div className="h-screen flex flex-col bg-[#0B1120] text-white">

      {/* ================= NAVBAR ================= */}

      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800">

        <div className="flex items-center gap-6">

          <h1 className="font-bold text-lg text-indigo-400">
            CodeCanvas AI
          </h1>

          <div className="flex gap-4 text-sm text-gray-400">
            <span className="cursor-pointer hover:text-white">Problems</span>
            <span className="cursor-pointer hover:text-white">Contests</span>
            <span className="cursor-pointer hover:text-white">Leaderboard</span>
          </div>

        </div>

        <input
          className="bg-[#111827] px-3 py-1 rounded text-sm outline-none"
          placeholder="Jump to problem..."
        />

      </div>


      {/* ================= PROBLEM HEADER ================= */}

      <div className="px-6 py-4 border-b border-gray-800 space-y-2">

        {/* TITLE + DIFFICULTY */}

        <div className="flex items-center gap-3">

          <h2 className="text-lg font-semibold">
            {problem.title}
          </h2>

          <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded">
            {problem.difficulty}
          </span>

        </div>


        {/* TAGS */}

        <div className="flex gap-2 flex-wrap text-xs">

          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 rounded"
            >
              {tag}
            </span>
          ))}

        </div>


        {/* COMPANIES */}

        <div className="flex gap-2 flex-wrap text-xs">

          {companies.map(company => (
            <span
              key={company}
              className="px-2 py-1 bg-indigo-900 text-indigo-300 rounded"
            >
              {company}
            </span>
          ))}

        </div>


        {/* ORIGINAL LINK */}

        <div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-400 hover:underline"
          >
            Original Problem →
          </a>

        </div>

      </div>


      {/* ================= WORKSPACE ================= */}

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT WHITEBOARD */}

        <div className="w-1/2 border-r border-gray-800 bg-[#0F172A]">

          <div className="p-3 text-sm text-gray-400 border-b border-gray-800">
            Logic Lab Whiteboard
          </div>

          <Whiteboard problem = {problem}/>

        </div>


        {/* RIGHT COMPILER */}

        <div className="w-1/2 bg-[#020617]">

          <Compiler />

        </div>

      </div>

    </div>

  )

}

export default ProblemWorkspace