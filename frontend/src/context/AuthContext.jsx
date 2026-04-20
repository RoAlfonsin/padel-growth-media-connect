import { createContext, useEffect, useState } from "react"
import { fetchWithAuth } from "../utils/apiClient"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetchWithAuth("/auth/me")
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error(err)
      logout()
    }
  }

  const login = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    fetchUser()
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}