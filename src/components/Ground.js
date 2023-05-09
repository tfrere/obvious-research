import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector, MeshReflectorMaterial } from '@react-three/drei'

function Ground({ speed = 0.05, settings }) {
  const groundMesh = useRef()
  const groundMesh2 = useRef()
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  //   const [floor, normal] = useTexture(['/MetalPlateStudded001_COL_2K_METALNESS.png', '/MetalPlateStudded001_COL_2K_METALNESS.png'])
  useFrame((state) => {
    groundMesh.current.position.x += speed
    if (groundMesh.current.position.x > 300) groundMesh.current.position.x = 0

    groundMesh2.current.position.x += speed
    if (groundMesh2.current.position.x > 0) groundMesh2.current.position.x = -300
  })

  const materialSettings = {
    // resolution: 2048,
    // blur: [1000, 1000],
    // mixBlur: 1,
    // mixStrength: 1,
    // roughnessMap: floor,
    // normalMap: normal,
    // distortionMap: normal,
    // distortion: 3,
    // color: settings.backgroundColor,
    // metalness: 0.5

    blur: [4000, 100],
    resolution: 1024,
    mixBlur: 1000,
    opacity: 2,
    depthScale: 1.1,
    minDepthThreshold: 0.4,
    maxDepthThreshold: 1.25,
    distortionMap: normal,
    distortion: 3,
    roughness: 1,
    color: settings.backgroundColor
  }

  //   const materialSettings = {
  //     blur: [10, 10],
  //     resolution: 2048,
  //     mixBlur: 1,
  //     mixStrength: 1,
  //     // roughnes:{1,
  //     roughnessMap: floor,
  //     normalMap: normal,
  //     distortionMap: normal,
  //     distortion: 3,
  //     // depthScal:{1.2,
  //     // minDepthThreshol:{0.4,
  //     // maxDepthThreshol:{1.4,
  //     color: settings.backgroundColor,
  //     metalness: 0.5
  //   }

  return (
    <>
      <mesh ref={groundMesh} receiveShadow position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[300, 300]} />
        <MeshReflectorMaterial {...materialSettings} />
      </mesh>

      <mesh ref={groundMesh2} receiveShadow position={[-300, -5, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[300, 300]} />
        <MeshReflectorMaterial {...materialSettings} />
      </mesh>
    </>
  )
}

export default Ground
