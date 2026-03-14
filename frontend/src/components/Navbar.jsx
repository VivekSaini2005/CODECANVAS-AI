import { Link } from "react-router-dom"

function Navbar() {

  return (
    <div className="bg-black text-white p-4 flex justify-between">

      <h1 className="text-xl font-bold">
        CodeCanvas
      </h1>

      <div className="flex gap-4">

        <Link to="/">Dashboard</Link>
        <Link to="/sheets">Sheets</Link>

      </div>

    </div>
  )

}

export default Navbar