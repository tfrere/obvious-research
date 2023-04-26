import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line, Edges, Segments, Segment, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'
import { useSprings, animated, config } from '@react-spring/three'

import randomRange from '../utils/randomRange'

export default function MovingLines(props) {
  const random = (i) => {
    return {
      scale: [randomRange(0.1, props.maxSize), 1, 1]
    }
  }

  const [springs, set] = useSprings(
    props.number,
    (i) => ({
      from: random(i),
      config: { loop: true } // , ...config.wobbly
    }),
    []
  )

  useEffect(() => void setInterval(() => set((i) => ({ ...random(i), delay: i * 40 })), 150), [])

  return (
    <group position={props.position}>
      <mesh scale={[0.01, 0.28, 0.01]} position={[-0.05, 0.13, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>

      {springs.map((spring, i) => {
        return (
          <animated.group key={i} {...spring}>
            <animated.mesh scale={[props.maxSize, 0.01, 0.01]} position={[props.maxSize / 2, i * props.gap, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="white" opacity={1} />
            </animated.mesh>
          </animated.group>
        )
      })}
    </group>
  )
}
