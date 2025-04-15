import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function generateRandomColor(keyword: string) {
  const hash = Array.from(keyword).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360
  return `hsl(${hue}, 60%, 55%)`
}

function Planet({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const bump = new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moonbump1k.jpg")
  const clouds = new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earthcloudmap.jpg")

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
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
        opacity={0.9}
        transparent
      />
    </mesh>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [planetColor, setPlanetColor] = useState(generateRandomColor('default'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchTerm.trim().toLowerCase()
    if (!trimmed) return
    const color = generateRandomColor(trimmed)
    setPlanetColor(color)
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
          placeholder="Enter a world... e.g. forest, volcano, dream"
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
