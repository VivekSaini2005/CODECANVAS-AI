import { useEffect, useState } from "react"
import API from "../services/api"
import { Link } from "react-router-dom"
import ProgressBar from "../components/ProgressBar"

function Sheets(){

  const [sheets,setSheets] = useState([])

  useEffect(()=>{

    const fetchSheets = async ()=>{

      const res = await API.get("/sheets")

      setSheets(res.data)

    }

    fetchSheets()

  },[])

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        DSA Sheets
      </h1>

      {sheets.map(sheet =>(

        <Link key={sheet.id} to={`/sheet/${sheet.id}`}>

            <div className="border border-gray-700 p-4 rounded mb-4">

            <h2 className="text-lg font-semibold">
                {sheet.name}
            </h2>

            <p className="text-sm text-gray-400">
                {sheet.description}
            </p>

            <div className="mt-3">
                <ProgressBar value={40} />
            </div>

            </div>

        </Link>

      ))}

    </div>

  )

}

export default Sheets