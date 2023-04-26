import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SpotLight, Shake, Text, Stars, Segments, Segment, Html, Stats, Float, Edges, Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSpring, animated, easings } from '@react-spring/three'

import Fireflies from '../components/Fireflies'
import Glyph from '../components/Glyph'
import TexturedPlane from '../components/TexturedPlane'
import Sparks from '../components/Sparks'
import City from '../components/City'
import MovingLines from '../components/MovingLines'
import { ContinuousCircle, DashedCircle } from '../components/Lines'
import TextScramble from '../components/TextScramble'
import Altar from '../components/Altar'
import Graph from '../components/Graph'
import useInterval from '../utils/useInterval'

import wiresUrl from '../public/less-wires.png'
import obviousLogoUrl from '../public/obvious-logo-shape-only.png'
const MainScene = (props) => {
  const { camera, renderer, mouse } = useThree()
  const [x, setX] = useState(0)

  useFrame(({ mouse, clock }) => {
    //setX( camera.position.x )

    //camera.position.setX(x)

    camera.position.setX(-mouse.x * 3)
    //camera.position.setY(-mouse.y / 3)
    camera.lookAt(0, 0.7, 0)
  })

  return (
    <>
      {props.debugMode ? (
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
          <City number={5} gap={0.5} maxSize={1} position={[-1, -1, -1]} />
        </>
      ) : (
        <>
          <Fireflies color="#FF0000" count={20} scale={[0.03, 0.03, 0.03]} position={[0, 2, 0]} />
          <Float floatIntensity={1} speed={5} floatingRange={[0.45, 0.55]} rotationIntensity={0}>
            <Glyph scale={[0.7, 0.7, 0.7]} position={[0, 2, 0]} canvasPortalRef={props.canvasPortalRef} />
          </Float>
          <TexturedPlane imageUrl={obviousLogoUrl} scale={[0.3, 0.3, 0.3]} position={[0.7, 0.6, 1]} />
          <TexturedPlane imageUrl={wiresUrl} opacity={0.3} scale={[6, 6, 6]} rotation={[Math.PI / 2, 0, 0]} position={[0, -1, 0]} />
          <MovingLines number={6} gap={0.05} maxSize={0.5} position={[-0.8, 0.45, 1]} />
          <Graph number={6} gap={0.05} maxSize={0.6} position={[-0.4, 0.45, 1]} />

          {/* top */}
          <ContinuousCircle rotation={[0, Math.PI / 8, 0]} dashLength={3} speed={0.1} isLeft={true} color={'white'} position={[0, 3.85, 0]} radius={0.1} />

          {/* bottom */}
          <ContinuousCircle rotation={[0, Math.PI / 8, 0]} dashLength={3} speed={0.1} isLeft={true} color={'white'} position={[0, 1.18, 0]} radius={0.1} />
          <DashedCircle rotation={[0, Math.PI / 8, 0]} dashLength={3} speed={1} color={'white'} position={[0, 1.18, 0]} radius={0.35} />

          <Altar />

          <TextScramble></TextScramble>
        </>
      )}
    </>
  )
}

// OK Faire marcher le morphText
// Smooth transition camera souris
// |-> ajouter orientation à la place de souris
// glyph qui fait face a la cam
// Rendre le cirtuit imprimé plus gros encore
// OK Console : rendre ça plus propre et cohérent

// OK on garde le carré qui bouge avec la souris gauche droite
// OK ajouter le logo obvious
// OK un lien vers obvious et vers massa sur les logos
// OK etendre le truc carte a puce plus loin
// OK mettre un changement de glyph au click

export default MainScene
