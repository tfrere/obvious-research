import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line, Edges, Segments, Segment, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'
import { useSprings, animated, config } from '@react-spring/three'

import randomRange from '../utils/randomRange'
import useInterval from '../utils/useInterval'

export default function Graph(props) {
  const ref = useRef([])
  const length = 7
  const gap = 0.05
  const amplitude = 0.23
  const [data, setData] = useState(Array.from({ length: length }, () => randomRange(0, amplitude)))

  useInterval(() => {
    let tmp = data
    tmp.shift()
    tmp.push(randomRange(0, amplitude))
    setData(tmp)
  }, 100)

  useFrame(({ clock }) => {
    ref.current.forEach((r, i) => {
      r.start.set((i - 1) * gap, 0.05 + data[i], 0)
      r.end.set(i * gap, 0.05 + data[i + 1], 0)
    })
  })

  return (
    <group {...props}>
      <mesh scale={[0.01, 0.28, 0.01]} position={[-0.1, 0.13, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>
      <mesh scale={[0.4, 0.01, 0.01]} position={[0.1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>

      <Segments limit={6} lineWidth={0.75}>
        {Array.from({ length: length }, () => randomRange(0, amplitude)).map((item, i) => {
          return <Segment key={i} ref={(r) => (ref.current[i] = r)} start={[0, 0, 0]} end={[0, 1, 0]} color={'white'} />
        })}
      </Segments>
    </group>
  )
}
