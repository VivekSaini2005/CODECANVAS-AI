import { Link } from "react-router-dom"

function Sidebar() {

  return (
    <div className="w-64 bg-black p-5">

      <h1 className="text-xl font-bold mb-6">
        CodeCanvas
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/sheets" className="hover:text-blue-400">
          Sheets
        </Link>

        <Link to="/progress" className="hover:text-blue-400">
          Progress
        </Link>

        <Link to="/profile" className="hover:text-blue-400">
          Profile
        </Link>

      </div>

    </div>
  )

}

export default Sidebar