import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector, MeshReflectorMaterial } from '@react-three/drei'

function Ground({ speed = 0.05, settings }) {
  const groundMesh = useRef()
  const groundMesh2 = useRef()
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  console.log
  useFrame((state) => {
    groundMesh.current.position.z += speed
    if (groundMesh.current.position.z > 300) groundMesh.current.position.z = 0

    groundMesh2.current.position.z += speed
    if (groundMesh2.current.position.z > 0) groundMesh2.current.position.z = -300
  })

  return (
    <>
      <mesh ref={groundMesh} receiveShadow position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[300, 300]} />
        <MeshReflectorMaterial
          blur={[10, 10]}
          resolution={2048}
          mixBlur={1}
          mixStrength={1}
          // roughness={1}
          roughnessMap={floor}
          normalMap={normal}
          distortionMap={normal}
          distortion={3}
          // depthScale={1.2}
          // minDepthThreshold={0.4}
          // maxDepthThreshold={1.4}
          color={settings.backgroundColor}
          metalness={0.5}
        />
      </mesh>

      <mesh ref={groundMesh2} receiveShadow position={[0, -5, -300]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[300, 300]} />
        <MeshReflectorMaterial
          blur={[10, 10]}
          resolution={2048}
          mixBlur={1}
          mixStrength={1}
          // roughness={1}
          roughnessMap={floor}
          normalMap={normal}
          distortionMap={normal}
          distortion={3}
          // depthScale={1.2}
          // minDepthThreshold={0.4}
          // maxDepthThreshold={1.4}
          color={settings.backgroundColor}
          metalness={0.5}
        />
      </mesh>
    </>
  )
}

export default Ground
