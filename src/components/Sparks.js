import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Segments, Segment } from '@react-three/drei'

const r = () => Math.max(0.2, Math.random())

function Fatline({ curve, width, color, speed }) {
  return <Segment start={curve[0]} end={curve[1]} />
}

export default function Sparks({ count, colors, radius = 10 }) {
  const mouse = useRef([0, 0])
  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        const pos = new THREE.Vector3(Math.sin(0) * radius * r(), Math.cos(0) * radius * r(), 0)
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2
          return pos.add(new THREE.Vector3(Math.sin(angle) * radius * r(), 0, Math.cos(angle) * radius * r())).clone()
        })
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve
        }
      }),
    [count]
  )

  const ref = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0 + mouse.current[1] / aspect / 200, 0.1)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0 + mouse.current[0] / aspect / 400, 0.1)
    }
  })

  return (
    <group ref={ref}>
      <group position={[-radius * 2, -radius, 0]} scale={[1, 1, 1]} rotation={[0, 0, 0]}>
        <Segments>
          {lines.map((props, index) => (
            <Fatline key={index} {...props} />
          ))}
        </Segments>
      </group>
    </group>
  )
}
