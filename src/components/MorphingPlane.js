import * as React from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'

export default function MorphingPlane() {
  return (
    <Plane args={[5, 5, 5, 5]}>
      <meshBasicMaterial transparent opacity={0} />
      <Edges>
        <lineBasicMaterial color={[20, 0.5, 20]} toneMapped={false} />
      </Edges>
    </Plane>
  )
}
