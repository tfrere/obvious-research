import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { SSAOPass, UnrealBloomPass } from 'three-stdlib'
import { EffectComposer, SSAO, Noise, Glitch, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Symmetry } from '../shader/Symmetry'
import { Line } from '../shader/Line'
import { Frame } from '../shader/Frame'
import { Perf } from 'r3f-perf'

extend({ SSAOPass, UnrealBloomPass })
import LabSimplex from './LabSimplex'
import { useControls } from 'leva'

const is_debug = false

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
  const { rotationSpeed, symmetryForce, cameraPosition, fogValue, chromaticGap } = useControls({
    rotationSpeed: {
      value: 0.4,
      min: 0,
      max: 60,
      step: 0.01
    },
    symmetryForce: {
      value: 1,
      min: 0,
      max: 2,
      step: 1
    },
    cameraPosition: {
      value: [0, 0, 160]
    },
    fogValue: {
      value: [0, 160]
    },
    chromaticGap: {
      value: 100,
      min: 0,
      max: 600,
      step: 1
    }
  })
  useEffect(() => {
    threeRef.clock.start()
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])
    camera.lookAt([0, 0, 0])
  }, [settings])

  // useFrame(() => {
  //   camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])
  //   camera.lookAt([0, 0, 0])
  // })
  const orbitControlProps = !is_debug
    ? {
        enablePan: false,
        enableZoom: false,
        enableRotate: false,
        enableDamping: false,
        minPolarAngle: 0,
        maxPolarAngle: 0,
        minDistance: 25,
        maxDistance: 75,
        autoRotate: true,
        autoRotateSpeed: rotationSpeed
      }
    : {
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        enableDamping: true
      }

  return (
    <>
      <Stats id={'99999999'} />
      <color attach="background" args={['#555']} />
      <spotLight position={[0, 50, 0]} intensity={0.25} />
      <OrbitControls {...orbitControlProps} />
      <LabSimplex settings={settings} position={[0, 10, 0]} />
      <fog ref={fogRef} attach="fog" args={['#555', fogValue[0], fogValue[1]]} />
      {settings.debugPerf && <Perf position="bottom-right" />}
      <EffectComposer>
        <Symmetry u_force={symmetryForce} />
        {/* <SSAO
          blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
          samples={100}
          radius={150}
          intensity={250}
          // rings={250}
          color="#000"
        /> */}
        <ChromaticAberration offset={5} />
        {/* <Glitch delay={[4.1, 8.1]} duration={[0.01, 0.02]} strength={[0.1, 0.4]} perturbationMap={null} /> */}
        <Noise opacity={0.03} />
        {/* <Frame /> */}
        {/* <Line /> */}
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
