import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SSAOPass, UnrealBloomPass } from 'three-stdlib'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Symmetry } from '../shader/Symmetry'
import { Frame } from '../shader/Frame'
import { Perf } from 'r3f-perf'

extend({ SSAOPass, UnrealBloomPass })

import LabSimplex from './LabSimplex'

const calculateDistance = (x1, y1, z1, x2, y2, z2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
  return distance
}

export const Lab = ({ settings }) => {
  const orbitControlRef = useRef()
  const fogRef = useRef()
  const threeRef = useThree()
  const { scene, camera, clock } = useThree()

  useEffect(() => {
    threeRef.clock.start()
    camera.position.set(20, 40, 35)
    camera.lookAt([0, 0, 0])
    console.log(camera.position)
  }, [settings])
  const orbitControlProps = true
    ? {
        enablePan: false,
        enableZoom: false,
        enableRotate: false,
        enableDamping: false,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 4,
        minDistance: 25,
        maxDistance: 75,
        autoRotate: true,
        autoRotateSpeed: 1.5
      }
    : {
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        enableDamping: true
      }

  return (
    <>
      {/* <color attach="background" args={[settings.backgroundColor]} /> */}
      <spotLight position={[0, 50, 0]} intensity={0.25} />
      <OrbitControls {...orbitControlProps} />
      <LabSimplex settings={settings} position={[0, 10, 0]} />
      <mesh receiveShadow position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[401, 401]} />
        <meshLambertMaterial color={'#555'} />
      </mesh>
      <fog ref={fogRef} attach="fog" args={['#555', 0, 80]} />
      {settings.debugPerf && <Perf position="bottom-right" />}
      <EffectComposer>
        {/* <Symmetry u_force={1} /> */}
        <SSAO
          blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
          samples={100}
          radius={150}
          intensity={50}
          // rings={250}
          color="#000"
        />
        <Frame />
      </EffectComposer>
    </>
  )
}

// const calculateDistance = (x1, y1, z1, x2, y2, z2) => {
//   const dx = x2 - x1
//   const dy = y2 - y1
//   const dz = z2 - z1
//   const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
//   return distance
// }

// export const Lab = ({ settings }) => {
//   const orbitControlRef = useRef()
//   const fogRef = useRef()
//   const threeRef = useThree()
//   const { scene, camera } = useThree()

//   useEffect(() => {
//     threeRef.clock.start()
//     threeRef.camera.position.set(0, 70, 0)
//     threeRef.camera.lookAt([0, 0, 0])
//     console.log(threeRef.camera.position)
//   }, [settings])

//   // do not affect perfs
//   useFrame(() => {
//     if (fogRef.current) {
//       const farValue = calculateDistance(threeRef.camera.position.x, threeRef.camera.position.y, threeRef.camera.position.z, 0, 0, 0)
//       fogRef.current.far = 40 + farValue * 1.2
//     }
//   })

//   settings.groundMaterialSettings = {
//     blur: [3000, 100],
//     resolution: 1024,
//     mixBlur: 1000,
//     depthScale: 2,
//     minDepthThreshold: 0.01,
//     maxDepthThreshold: 15,
//     distortion: 3,
//     distortionScale: 5.5,
//     roughness: 1,
//     metalness: 1,
//     color: 'blue'
//   }

//   return (
//     <>
//       <spotLight position={[0, 50, 0]} intensity={0.25} /> {/* <color attach="background" args={[settings.backgroundColor]} /> */}
//       <OrbitControls regress rotateSpeed={0.01} autoRotate={false} ref={orbitControlRef} {...settings.orbitControlConfig} />
//       <LabSimplex settings={settings} position={[0, 10, 0]} />
//       {/* <Sphere args={[1, 100, 100]} position={[0, 0, 0]} scale={[3, 3, 3]}>
//         <MeshDistortMaterial color={settings.colors[0]} speed={2} distort={1} radius={1} />
//       </Sphere> */}
//       {/* <Ground settings={settings} position={[0, -10, 0]} speed={1} /> */}
//       <fog ref={fogRef} attach="fog" args={[settings.fogColor, 0, 20]} />
//       <fog attach="fog" args={['red', 10, 12]} />
//       {settings.debugPerf && <Perf position="bottom-right" />}
//       {/* <Symmetry u_force={1} /> */}
//       {/* <EffectComposer>
//         <SSAO
//           blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
//           samples={10}
//           radius={150}
//           intensity={200}
//           // rings={250}
//           color="#0000FF"
//         />
//       </EffectComposer> */}
//       {/* <ChromaticAberration offset={3} /> */}
//       {/* <Effects>
//         <sSAOPass args={[scene, camera]} kernelRadius={1.5} maxDistance={1.5} />
//       </Effects> */}
//     </>
//   )
// }

// // blendFunction?: BlendFunction;
// // samples?: number;
// // rings?: number;
// // distanceThreshold?: number;
// // distanceFalloff?: number;
// // rangeThreshold?: number;
// // rangeFalloff?: number;
// // luminanceInfluence?: number;
// // radius?: number;
// // scale?: number;
// // bias?: number;
// // intensity?: number;
// // color?: string;

// // {/* <Bloom luminanceThreshold={0.1} intensity={0.5} levels={5} mipmapBlur /> */}
// // {/* <Kaleidoscope u_symmetryPoints={2} /> */}
// // {/* <RenderPass /> */}
// // {/* <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} /> */}
// // {/* <Glitch delay={[4.1, 8.1]} duration={[0.2, 0.5]} strength={[0.1, 0.4]} perturbationMap={null} /> */}
// // {/* <Noise /> */}
// // {/* <SSAO kernelRadius={0.5} maxDistance={0.1} /> */}
// // {/* <unrealBloomPass threshold={0.9} strength={0.75} radius={0.5} /> */}
// // {/* <DepthOfField target={[8, 0.1, -12]} height={480} focusRange={10} bokehScale={8} /> */}
