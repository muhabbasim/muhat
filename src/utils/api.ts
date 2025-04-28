import axios from "axios"

const api = () => {
  const token = localStorage.getItem("ai-auth-token")
  const language = localStorage.getItem("language") || "en"

  const apiCall = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": language,
    },
  })

  return apiCall
}

export default api