import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

const fetchGPTData = async (keyword: string): Promise<{ color: string, summary: string, keywords: string[] }> => {
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
        content: `Imagine a planet that represents "${keyword}".
1. What color is this planet? (Give a hex code like #00FF00)
2. Describe it in 1 sentence.
3. Give 3 related keywords. Reply as JSON with keys: color, summary, keywords`
      }],
      temperature: 0.7
    })
  })
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  try {
    return JSON.parse(content)
  } catch (err) {
    return { color: '#888888', summary: 'Unknown world', keywords: [] }
  }
}

function Planet({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg")

  useFrame(() => {
    meshRef.current.rotation.y += 0.002
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} color={color} />
    </mesh>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [color, setColor] = useState('#888888')
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setLoading(true)
    const result = await fetchGPTData(searchTerm.trim())
    setColor(result.color)
    setSummary(result.summary)
    setKeywords(result.keywords)
    setLoading(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Planet color={color} />
        <Text position={[0, -3.2, 0]} fontSize={0.35} color="white">
          {summary}
        </Text>
        {keywords.map((k, i) => (
          <Text key={i} position={[Math.cos(i * 2) * 4, 1.5 - i, Math.sin(i * 2) * 4]} fontSize={0.25} color="skyblue">
            {k}
          </Text>
        ))}
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
          placeholder={loading ? 'GPT is imagining...' : 'Type a world (e.g. volcano, dream)'}
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
