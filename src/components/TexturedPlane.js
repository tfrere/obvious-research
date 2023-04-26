import React, { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture, Float, Edges, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'

function Image(props) {
  const texture = useLoader(THREE.TextureLoader, props.url)
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <meshBasicMaterial opacity={props.opacity} transparent side={THREE.DoubleSide} attach="material" map={texture} />
    </mesh>
  )
}

export default function TexturedPlane(props) {
  return (
    <group {...props}>
      <Image url={props.imageUrl} />
    </group>
  )
}
