import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="royalblue" />
        </mesh>
        <OrbitControls />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontSize: '1.5rem',
        }}
      >
        Hello GPT Constellation
      </div>
    </div>
  )
}
