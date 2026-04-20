const API_URL = import.meta.env.VITE_API_URL

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Error en la solicitud")
    }

    return res
}

export default API_URL