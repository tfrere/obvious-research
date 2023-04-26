import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SpotLight, Shake, Text, Stars, Segments, Segment, Html, Stats, Float, Edges, Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSpring, animated, easings } from '@react-spring/three'

import Fireflies from '../components/Fireflies'
import Glyph from '../components/Glyph'
import ObviousLogo from '../components/ObviousLogo'
import Sparks from '../components/Sparks'
import City from '../components/City'
import MovingLines from '../components/MovingLines'
import { ContinuousCircle, DashedCircle } from '../components/Lines'
import TextScramble from '../components/TextScramble'
import Altar from '../components/Altar'
import Graph from '../components/Graph'
import TexturedPlane from '../components/TexturedPlane'
import useInterval from '../utils/useInterval'
import bottomUrl from '../public/bottom.png'

const WorkScene = (props) => {
  const { camera, renderer, mouse } = useThree()
  const [x, setX] = useState(0)

  return (
    <>
      <OrbitControls />
      {false ? (
        <>
          <mesh receiveShadow scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="grey" />
          </mesh>
          <mesh receiveShadow scale={[0.5, 0.5, 0.5]} position={[-3, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="grey" />
          </mesh>
          <SpotLight
            castShadow
            distance={20}
            intensity={0.1}
            angle={THREE.MathUtils.degToRad(45)}
            color={'#fadcb9'}
            position={[0, 5, 0]}
            volumetric={true}
            debug={true}
          />
          <TexturedPlane imageUrl={bottomUrl} opacity={0.3} scale={[6, 6, 6]} rotation={[Math.PI / 2, 0, 0]} position={[0, -1, 0]} />
        </>
      ) : null}
      <>
        <DashedCircle items={64} rotation={[0, Math.PI / 8, 0]} dashLength={10} speed={1} color={'red'} position={[0, -1, 0]} radius={2.35} />
        <City number={5} gap={0.5} maxSize={1} position={[-1, -1, -1]} />
      </>
    </>
  )
}

export default WorkScene
