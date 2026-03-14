import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import API from "../services/api"
import ProblemTable from "../components/ProblemTable"

function SheetProblems(){

  const {id} = useParams()

  const [problems,setProblems] = useState([])

  useEffect(()=>{

    const fetchProblems = async ()=>{

      const res = await API.get(`/sheets/${id}`)

      setProblems(res.data)

    }

    fetchProblems()

  },[id])

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Problems
      </h1>

      <ProblemTable problems={problems}/>

    </div>

  )

}

export default SheetProblems