import axios from "axios"

const API = axios.create({
  baseURL: "https://codecanvas-ai-evfn.onrender.com/api" || "http://localhost:5000/api",
})

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token")

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

export default API
