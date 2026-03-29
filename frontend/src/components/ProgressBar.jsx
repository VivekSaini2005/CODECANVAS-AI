function ProgressBar({ value }) {

  return (
    <div className="w-full bg-gray-700 rounded-full h-3">

      <div
        className="bg-green-500 h-3 rounded-full"
        style={{ width: `${value || 0}%` }}
      />

    </div>
  )

}

export default ProgressBar