import { useEffect, useState } from "react"
import { Container, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../utils/apiClient"
import { useAuth } from "../hooks/useAuth"

function CreateReta() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [clubs, setClubs] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fecha: "",
    niveles:[],
    formato: "",
    cupos_max: 4,
    club_id: ""
  })

  const nivelesOptions = ["1ra", "2da", "3ra", "4ta", "5ta"]

  // 🚫 protección extra
  useEffect(() => {
    if (user && user.rol !== "master") {
      navigate("/")
    }
  }, [user])

  // 📡 cargar clubs
  useEffect(() => {
    const fetchClubs = async () => {
      const res = await fetchWithAuth("/clubs")
      const data = await res.json()
      setClubs(data)
    }

    fetchClubs()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const toggleNivel = (nivel) => {
    setForm(prev => {
      const has = prev.niveles.includes(nivel)
      const niveles = has ? prev.niveles.filter(n => n !== nivel) : [...prev.niveles, nivel]
      return { ...prev, niveles }
    })
}  

  const validate = () => {
    if (!form.fecha || !form.club_id || !form.formato) {
      return "Todos los campos son obligatorios"
    }

    if (form.cupos_max % 4 !== 0) {
      return "Los cupos deben ser múltiplos de 4"
    }

    if (form.niveles.length === 0) {
      return "Selecciona al menos un nivel"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const res = await fetchWithAuth("/retas", {
        method: "POST",
        body: JSON.stringify({
          fecha: form.fecha,
          nivel: form.niveles.sort((a, b) => nivelesOptions.indexOf(a) - nivelesOptions.indexOf(b)).join(", "),
          formato: form.formato,
          cupos_max: Number(form.cupos_max),
          club_id: form.club_id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Error al crear reta")
      }

      navigate("/")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-4">
      <h5 className="mb-3">Crear Reta</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Formato</Form.Label>
            <Form.Select name="formato" value={form.formato} onChange={handleChange}>
            <option value="">Selecciona un formato</option>
            <option value="6 Loco">6 Loco</option>
            <option value="Parejas Fijas">Parejas Fijas</option>
            <option value="Torneo">Torneo</option>
            <option value="Otro">Otro</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nivel (multiselección)</Form.Label>
          <div>
            {nivelesOptions.map((n) => (
              <Form.Check
                key={n}
                type="checkbox"
                id={`nivel-${n}`}
                label={n}
                checked={form.niveles.includes(n)}
                onChange={() => toggleNivel(n)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cupos</Form.Label>
          <Form.Control
            type="number"
            name="cupos_max"
            value={form.cupos_max}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Club</Form.Label>
          <Form.Select
            name="club_id"
            value={form.club_id}
            onChange={handleChange}
          >
            <option value="">Selecciona un club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Creando..." : "Crear Reta"}
        </Button>

      </Form>
    </Container>
  )
}

export default CreateReta