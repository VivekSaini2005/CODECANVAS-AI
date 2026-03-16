import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axiosInstance"

import Whiteboard from "../components/Whiteboard"
import Compiler from "../components/Compiler"

function ProblemWorkspace(){

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

    <div className="h-screen flex flex-col">

      {/* Problem Header */}

      <div className="p-4 border-b">

        <h1 className="text-xl font-bold">
          {problem.title}
        </h1>

        <p className="text-gray-500">
          {problem.difficulty}
        </p>

      </div>

      {/* Split Screen */}

      <div className="flex flex-1">

        {/* LEFT WHITEBOARD */}

        <div className="w-1/2 border-r">
          <Whiteboard/>
        </div>

        {/* RIGHT COMPILER */}

        <div className="w-1/2">
          <Compiler/>
        </div>

      </div>

    </div>

  )

}

export default ProblemWorkspace