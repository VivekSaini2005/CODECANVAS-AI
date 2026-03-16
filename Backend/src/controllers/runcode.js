const axios = require("axios")

const runcode = async (req, res) => {

  const { code, input, language_id } = req.body
    // console.log("data comes");
    // console.log(req.body);
  const encodeBase64 = (str) => Buffer.from(str || "").toString("base64")
  const decodeBase64 = (str) => str ? Buffer.from(str, "base64").toString("utf8") : ""

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        source_code: encodeBase64(code),
        stdin: encodeBase64(input),
        language_id: language_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    )

    const result = response.data
    
    // Extract the valid output text, decoding it from Base64
    let finalOutput = decodeBase64(result.stdout) || decodeBase64(result.stderr) || decodeBase64(result.compile_output) || ""
    
    if (result.status && result.status.id === 3 && !finalOutput) {
      finalOutput = "Execution succeeded with no output."
    }
    
    res.json({
      output: finalOutput
    })

  } catch (error) {
    console.error(error.response?.data || error.message)

    res.status(500).json({
      error: "Execution failed"
    })

  }

}

module.exports = runcode
