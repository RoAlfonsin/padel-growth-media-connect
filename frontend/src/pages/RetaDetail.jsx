import { useEffect, useState } from "react"
import { Container, Card, Badge, Button, Spinner, Alert, Image } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../utils/apiClient"
import LogoutButton from "../components/LogoutButton"
import { supabase } from "../services/supabase"

function RetaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [reta, setReta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 🚀 fetch
  const fetchReta = async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth(`/retas/${id}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail)

      setReta(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReta()
  }, [id])

  // ⚡ realtime (reta_players)
  useEffect(() => {
    const channel = supabase
      .channel("reta-detail")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reta_players",
          filter: `reta_id=eq.${id}`
        },
        () => {
          fetchReta()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  if (!reta) return null

  // 👥 separar jugadores
  const activos = reta.jugadores.slice(0, reta.cupos_max)
  const espera = reta.jugadores.slice(reta.cupos_max)

  const isFull = activos.length >= reta.cupos_max

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-3">

      {/* 🔙 volver */}
      <Button
        variant="link"
        size="sm"
        onClick={() => navigate("/")}
      >
        ← Volver
      </Button>

      {/* 🏟️ header */}
      <Card className="p-3 mb-3">
        <div className="d-flex align-items-center">

          <Image
            src={reta.club_logo_url}
            style={{ width: 60, height: 60, marginRight: 10 }}
          />

          <div>
            <div style={{ fontWeight: "bold" }}>
              {reta.club_nombre}
            </div>

            <div style={{ fontSize: 12 }}>
              {new Date(reta.fecha).toLocaleString('es-ES', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
                })
            }
            </div>

            <div style={{ fontSize: 12 }}>
              Nivel: {reta.nivel} • Formato: {reta.formato}
            </div>
          </div>

        </div>

        <div className="mt-2">
          <Badge bg={isFull ? "danger" : "success"}>
            {reta.cupos_ocupados}/{reta.cupos_max} jugadores
          </Badge>
        </div>
      </Card>

      {/* 👥 jugadores */}
      <h6>Jugadores</h6>

      {activos.map((j, i) => (
        <Card key={i} className="mb-1 p-1 d-flex flex-row justify-content-between">
          <div style={{ fontSize: "12px"}}>
            <span style={{ fontWeight: "bold", marginRight: "8px" }}>{i + 1}.</span>
            {j.nombre}
            {!j.user_id && <span style={{ fontSize: 10 }}> (Invitado)</span>}
          </div>

          {j.confirmado ? (
            <Badge bg="success" style={{ fontSize: "10px" }} >✓</Badge>
          ) : (
            <Badge bg="secondary" style={{ fontSize: "10px" }}>✓</Badge>
          )}
        </Card>
      ))}

      {/* ⏳ lista de espera */}
      {espera.length > 0 && (
        <>
          <h6 className="mt-3">Lista de espera</h6>

          {espera.map((j, i) => (
            <Card key={i} className="mb-1 p-1 d-flex flex-row justify-content-between">
              <div style={{ fontSize: "12px"}}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>{reta.cupos_max + i + 1}.</span>
                {j.nombre}
                {!j.user_id && j.inviter_name && (
                  <span style={{ fontSize: 10 }}> (Invitado de {j.inviter_name})</span>
                )}
                {!j.user_id && !j.inviter_name && (
                  <span style={{ fontSize: 10 }}> (Invitado)</span>
                )}
              </div>

              {j.confirmado ? (
                <Badge bg="success" style={{ fontSize: "10px" }} >✓</Badge>
              ) : (
                <Badge bg="secondary" style={{ fontSize: "10px" }}>✓</Badge>
              )}
            </Card>
          ))}
        </>
      )}

      {/* 💬 WhatsApp */}
      <Button
        variant="success"
        className="w-100 mt-3"
        onClick={() =>
          window.open(`https://wa.me/525549504240`, "_blank")
        }
      >
        Contactar por WhatsApp
      </Button>

      {/* 🔓 logout */}
      <LogoutButton />

    </Container>
  )
}

export default RetaDetail