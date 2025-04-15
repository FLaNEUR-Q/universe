import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const fetchGPTColor = async (keyword: string): Promise<string> => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Imagine a planet representing "${keyword}". What color best represents it? Reply with a single CSS color code like "#00FF00".`
      }],
      temperature: 0.7
    })
  })
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  return /^#[0-9A-Fa-f]{6}$/.test(text) ? text : '#888888'
}

function Planet({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const bump = new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moonbump1k.jpg")

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color={color}
        bumpMap={bump}
        bumpScale={0.1}
        metalness={0.4}
        roughness={0.7}
      />
    </mesh>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [planetColor, setPlanetColor] = useState('#888888')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const color = await fetchGPTColor(trimmed)
      setPlanetColor(color)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Planet color={planetColor} />
        <OrbitControls enablePan={false} enableZoom={false} />
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
          placeholder={loading ? 'Loading GPT...' : 'Search a planet'
          }
          disabled={loading}
          style={{
            padding: '1rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            fontSize: '1.2rem',
            outline: 'none',
            width: '320px',
            textAlign: 'center',
          }}
        />
      </form>
    </div>
  )
}
