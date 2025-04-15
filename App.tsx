import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const ref = useRef()
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        console.log("🟢 텍스처 로드 성공!", tex)
        setTexture(tex)
      },
      undefined,
      (err) => {
        console.error("🔴 텍스처 로드 실패!", err)
      }
    )
  }, [])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0015
  })

  if (!texture) return null

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 2, 5]} intensity={2} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Earth />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
