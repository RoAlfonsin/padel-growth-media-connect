import { useEffect, useState } from "react"
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../utils/apiClient"
import { useAuth } from "../hooks/useAuth"

function Jugadores() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 🚫 protección
  useEffect(() => {
    if (user && user.rol !== "master") {
      navigate("/")
    }
  }, [user])

  // 📡 fetch
  const fetchJugadores = async () => {
    try {
      setLoading(true)

      const res = await fetchWithAuth("/users")
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail)

      setJugadores(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJugadores()
  }, [])

  // 🚫 vetar
  const handleVeto = async (userId) => {
    const confirmacion = window.confirm("¿Seguro que quieres vetar a este jugador?")

    if (!confirmacion) return

    try {
      const res = await fetchWithAuth(`/vetos/vetar/${userId}`, {
        method: "POST"
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Error al vetar")
      }

      fetchJugadores()

    } catch (err) {
      setError(err.message)
    }
  }

  // 💬 whatsapp
  const handleWhatsapp = async (userId) => {
    try {
      const res = await fetchWithAuth(`/users/${userId}/whatsapp-link`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail)
      }

      window.open(data.whatsapp_link, "_blank")

    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    )
  }

  return (
    <Container style={{ maxWidth: "500px" }} className="mt-3">

      <Button variant="link" onClick={() => navigate("/")}>
        ← Volver
      </Button>

      <h5 className="mb-3">Jugadores</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      {jugadores.map((j) => (
        <Card key={j.id} className="mb-2 p-2">

          <div className="d-flex justify-content-between align-items-center">

            {/* info */}
            <div>
              <div>{j.nombre}</div>
              <div style={{ fontSize: 12 }}>
                Nivel {j.nivel}
              </div>
              {j.veto && (
                <div style={{ color: "red", fontSize: 12 }}>
                  Vetado
                </div>
              )}
            </div>

            {/* acciones */}
            <div className="d-flex gap-2">

              <Button
                size="sm"
                variant="outline-success"
                onClick={() => handleWhatsapp(j.id)}
              >
                WA
              </Button>

              {!j.veto && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleVeto(j.id)}
                >
                  Vetar
                </Button>
              )}

            </div>

          </div>

        </Card>
      ))}

    </Container>
  )
}

export default Jugadores