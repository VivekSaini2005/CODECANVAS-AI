import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axiosInstance"

function Problem(){

  const {slug} = useParams()

  const [problem,setProblem] = useState(null)

  useEffect(()=>{

    const fetchProblem = async ()=>{

      const res = await API.get(`/problems/${slug}`)

      setProblem(res.data.problem)

    }

    fetchProblem()

  },[slug])

  if(!problem) return <div>Loading...</div>

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold">
        {problem.title}
      </h1>

      <p className="text-sm text-gray-500">
        {problem.difficulty}
      </p>

      <a
        href={problem.problemLink}
        target="_blank"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Solve on Platform
      </a>

    </div>

  )

}

export default Problem