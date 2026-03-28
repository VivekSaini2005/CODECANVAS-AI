function StatCard({ title, value }) {

  return (
    <div className="bg-gray-800 p-5 rounded-lg">

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </div>
  )

}

export default StatCard