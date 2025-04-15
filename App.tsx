import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

const fetchGPTData = async (keyword) => {
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
        content: `Imagine a planet that represents the word "${keyword}". Reply ONLY with JSON in the following format:
{
  "color": "#00FF00",
  "summary": "A short poetic summary of the world.",
  "keywords": ["one", "two", "three"]
}`
      }],
      temperature: 0.7
    })
  })
  const data = await res.json()
  try {
    return JSON.parse(data.choices?.[0]?.message?.content)
  } catch {
    return {
      color: '#3c80ff',
      summary: 'A peaceful blue Earth.',
      keywords: ['life', 'water', 'sky']
    }
  }
}

function Planet({ color }) {
  const planetRef = useRef()
  const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg")
  const atmosphereRef = useRef()

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.002
    if (atmosphereRef.current) atmosphereRef.current.rotation.y += 0.002
  })

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} color={color} />
      </mesh>
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshBasicMaterial color="#44ccff" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [planetColor, setPlanetColor] = useState('#3c80ff')
  const [summary, setSummary] = useState('A peaceful blue Earth.')
  const [keywords, setKeywords] = useState(['life', 'water', 'sky'])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setLoading(true)
    const result = await fetchGPTData(searchTerm.trim())
    setPlanetColor(result.color)
    setSummary(result.summary)
    setKeywords(result.keywords)
    setSearchTerm('')
    setLoading(false)
  }

  const handleKeywordClick = async (keyword) => {
    setLoading(true)
    const result = await fetchGPTData(keyword)
    setPlanetColor(result.color)
    setSummary(result.summary)
    setKeywords(result.keywords)
    setLoading(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <ambientLight intensity={0.3} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Planet color={planetColor} />
        <Text position={[0, -3.2, 0]} fontSize={0.35} color="white">
          {summary}
        </Text>
        {keywords.map((k, i) => (
          <Text
            key={i}
            position={[Math.cos(i * 2) * 4, 1.5 - i, Math.sin(i * 2) * 4]}
            fontSize={0.25}
            color="skyblue"
            onClick={() => handleKeywordClick(k)}
          >
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
