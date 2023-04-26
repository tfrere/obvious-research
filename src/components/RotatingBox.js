import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, Float, Edges, Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import { useSpring, animated } from '@react-spring/three'

export default function RotatingBox(props) {
  const spring = useSpring({
    loop: { reverse: true },
    from: { rotation: [-Math.PI, 0, 0] },
    to: { rotation: [0, 0, 0] },
    config: {
      mass: 2,
      tension: 140
    }
  })

  return (
    <animated.mesh position={props.position} rotation={spring.rotation}>
      <boxGeometry args={props.args} />
      <meshBasicMaterial transparent opacity={0} />
      <Edges scale={1} threshold={11.2}>
        <lineBasicMaterial color={[20, 0.5, 20]} toneMapped={false} />
      </Edges>
    </animated.mesh>
  )
}
