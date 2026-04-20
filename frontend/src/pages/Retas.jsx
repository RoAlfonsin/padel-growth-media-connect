import { useEffect, useState } from "react"
import { Container, Card, Button, Spinner, Alert, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../utils/apiClient"
import LogoutButton from "../components/LogoutButton"
import { supabase } from "../services/supabase"

function Retas() {
  const navigate = useNavigate()

  const [retas, setRetas] = useState([])
  const [tipo, setTipo] = useState("activas")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 🚀 fetch retas
  const fetchRetas = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await fetchWithAuth(`/retas?tipo=${tipo}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Error al cargar retas")
      }

      setRetas(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 📡 inicial + cambio de tipo
  useEffect(() => {
    fetchRetas()
  }, [tipo])

  // ⚡ supabase Realtime (placeholder simple)
    useEffect(() => {
    const channel = supabase
      .channel("retas")
      .on(
        "postgres_changes",
        { event: "*",
          schema: "public",
          table: "retas" },
        () => {
          fetchRetas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tipo])
  

  return (
    <Container className="mt-4" style={{ maxWidth: "500px" }}>

      {/* 🔁 toggle */}
      <div className="d-flex justify-content-between mb-3">
        <Button
          size="sm"
          variant={tipo === "activas" ? "primary" : "outline-primary"}
          onClick={() => setTipo("activas")}
        >
          Activas
        </Button>

        <Button
          size="sm"
          variant={tipo === "historial" ? "primary" : "outline-primary"}
          onClick={() => setTipo("historial")}
        >
          Historial
        </Button>
      </div>

      {/* 🔄 loading */}
      {loading && (
        <div className="text-center mt-5">
          <Spinner />
        </div>
      )}

      {/* ❌ error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* 📋 lista */}
      {!loading && retas.length === 0 && (
        <p className="text-center mt-4">No hay retas disponibles</p>
      )}

      {!loading &&
        retas.map((reta) => (
          <Card
            key={reta.id}
            className="mb-3 p-2"
            onClick={() => navigate(`/retas/${reta.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">

              {/* 🏟️ logo club */}
              <Image
                src={reta.club_logo_url}
                rounded
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  marginRight: "12px"
                }}
              />

              {/* 📊 info */}
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold" }}>
                  {reta.club_nombre}
                </div>

                <div style={{ fontSize: "12px" }}>
                  {new Date(reta.fecha).toLocaleString()}
                </div>

                <div style={{ fontSize: "12px" }}>
                  Nivel: {reta.nivel} • {reta.formato}
                </div>

                <div style={{ fontSize: "12px" }}>
                  Cupos: {reta.total_jugadores}/{reta.cupos_max}
                </div>
              </div>

            </div>
          </Card>
        ))}

      {/* 🔓 logout */}
      <LogoutButton />

    </Container>
  )
}

export default Retas