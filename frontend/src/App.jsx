import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [status, setStatus] = useState('cargando...')

  useEffect(() => {
    fetch('http://13.219.103.86:3001/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data)
        setStatus('conectado')
      })
      .catch(() => setStatus('sin conexión'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ color: '#f0f0f0' }}> InnovaTech DevOps</h1>
      <p style={{ color: '#666' }}>Plataforma CI/CD — ISY1101 DuocUC 2026</p>

      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <strong>Estado del backend:</strong> {status === 'conectado'
          ? '✅ Conectado a PostgreSQL en AWS RDS'
          : status === 'sin conexión'
          ? '❌ Sin conexión'
          : '⏳ Cargando...'}
      </div>

      <h2>Productos en base de datos</h2>
      {productos.length === 0
        ? <p>Cargando productos...</p>
        : productos.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p><strong>Precio:</strong> ${Number(p.precio).toLocaleString()}</p>
            <p><strong>Stock:</strong> {p.stock} unidades</p>
          </div>
        ))
      }
    </div>
  )
}

export default App