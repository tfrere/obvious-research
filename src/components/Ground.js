import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector, MeshReflectorMaterial } from '@react-three/drei'

import textureUrl from '../public/images/SurfaceImperfections003_1K_var1.jpg'
import normalUrl from '../public/images/SurfaceImperfections003_1K_Normal.jpg'

function Ground({ speed = 0.015, color, settings }) {
  const groundMesh = useRef()
  const groundMesh2 = useRef()
  const [floor, normal] = useTexture([textureUrl, normalUrl])
  // const [floor, normal] = useTexture(['/MetalPlateStudded001_COL_2K_METALNESS.png', '/MetalPlateStudded001_COL_2K_METALNESS.png'])

  const activeColor = useMemo(() => {
    return new THREE.Color(color ? color : settings.backgroundColor)
  }, [color ? color : settings.backgroundColor])

  useFrame((state, delta) => {
    groundMesh.current.position.x -= speed * delta
    if (groundMesh.current.position.x < -400) groundMesh.current.position.x = 0

    groundMesh2.current.position.x -= speed * delta
    if (groundMesh2.current.position.x < 0) groundMesh2.current.position.x = 400
  })

  let materialSettings = {
    blur: [3000, 100],
    resolution: 1024,
    mixBlur: 1000,
    depthScale: 2,
    minDepthThreshold: 0.01,
    maxDepthThreshold: 0.5,
    // roughnessMap: floor,
    distortionMap: normal,
    distortion: 3,
    distortionScale: 5.5,
    roughness: 1,
    // color: 'transparent',
    metalness: 1,
    color: activeColor
  }

  // let materialSettings = {
  //   blur: [10, 10],
  //   resolution: 1024,
  //   mixBlur: 1,
  //   mixStrength: 1,
  //   // roughnes:{1,
  //   roughnessMap: floor,
  //   normalMap: normal,
  //   // normalScale: [0.55, 0.55],
  //   distortionMap: normal,
  //   distortion: 1
  //   // depthScal:1.2,
  //   // minDepthThreshol:0.4,
  //   // maxDepthThreshol:1.4,
  //   // color: 'transparent'
  //   // metalness: 1
  // }

  return (
    <>
      <mesh ref={groundMesh} receiveShadow position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[401, 401]} />
        <MeshReflectorMaterial {...materialSettings} />
      </mesh>

      <mesh ref={groundMesh2} receiveShadow position={[-400, -8, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[401, 401]} />
        <MeshReflectorMaterial {...materialSettings} />
      </mesh>
    </>
  )
}

export default Ground
