import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const planetRef = useRef()
  const texture = new THREE.TextureLoader().load("https://cdn.jsdelivr.net/gh/rajatdiptabiswas/planet-textures@main/2k_earth_daymap.jpg")

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.0015
  })

  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 2, 5]} intensity={2} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Earth />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
