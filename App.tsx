import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [submittedTerm, setSubmittedTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSubmittedTerm(searchTerm.trim())
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight />
        <OrbitControls />
      </Canvas>

      <form
        onSubmit={handleSubmit}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Explore the GPT Universe..."
          style={{
            padding: '1rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            fontSize: '1.2rem',
            outline: 'none',
            width: '300px',
            textAlign: 'center',
          }}
        />
      </form>

      {submittedTerm && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '1.5rem',
            zIndex: 10,
          }}
        >
          Searching for: {submittedTerm}
        </div>
      )}
    </div>
  )
}
