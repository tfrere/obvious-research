import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { randomSnap } from '@georgedoescode/generative-utils'
import {
  Loader,
  Stats,
  Float,
  Edges,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  Reflector,
  Box,
  Sphere,
  MeshDistortMaterial,
  shaderMaterial,
  Cloud,
  Effects
} from '@react-three/drei'
import { SSAOPass, UnrealBloomPass } from 'three-stdlib'
import { ChromaticAberration, DepthOfField, Glitch, EffectComposer, Bloom, Noise, SSAO, SelectiveBloom } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
import { Perf } from 'r3f-perf'

extend({ SSAOPass, UnrealBloomPass })

import Lines from './Lines/Lines'

import LabSimplex from './LabSimplex'
import Ground from './Ground'

import { Symmetry } from '../shader/Symmetry'
import { Frame } from '../shader/Frame'
import { Line } from '../shader/Line'

import { Kaleidoscope } from '../shader/Kaleidoscope'

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
  const { scene, camera } = useThree()

  useEffect(() => {
    threeRef.clock.start()
    threeRef.camera.position.set(0, 70, 0)
    threeRef.camera.lookAt([0, 0, 0])
    console.log(threeRef.camera.position)
  }, [settings])

  // do not affect perfs
  useFrame(() => {
    if (fogRef.current) {
      const farValue = calculateDistance(threeRef.camera.position.x, threeRef.camera.position.y, threeRef.camera.position.z, 0, 0, 0)
      fogRef.current.far = 40 + farValue * 1.2
    }
  })

  settings.groundMaterialSettings = {
    blur: [3000, 100],
    resolution: 1024,
    mixBlur: 1000,
    depthScale: 2,
    minDepthThreshold: 0.01,
    maxDepthThreshold: 15,
    distortion: 3,
    distortionScale: 5.5,
    roughness: 1,
    metalness: 1,
    color: 'blue'
  }

  return (
    <>
      <spotLight position={[0, 50, 0]} intensity={1.75} /> {/* <color attach="background" args={[settings.backgroundColor]} /> */}
      <OrbitControls regress rotateSpeed={0.2} autoRotate={true} ref={orbitControlRef} {...settings.orbitControlConfig} />
      <LabSimplex settings={settings} position={[0, 10, 0]} />
      {/* <Sphere args={[1, 100, 100]} position={[0, 0, 0]} scale={[3, 3, 3]}>
        <MeshDistortMaterial color={settings.colors[0]} speed={2} distort={1} radius={1} />
      </Sphere> */}
      {/* <Ground settings={settings} position={[0, -10, 0]} speed={1} /> */}
      <fog ref={fogRef} attach="fog" args={settings.fog} />
      {settings.debugPerf && <Perf position="bottom-right" />}
      <EffectComposer>
        {/* <Symmetry u_force={1} /> */}
        <SSAO
          blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
          samples={10}
          radius={150}
          intensity={200}
          // rings={250}
          color="#0000FF"
        />
        {/* <ChromaticAberration offset={3} /> */}
      </EffectComposer>
      {/* <Effects>
        <sSAOPass args={[scene, camera]} kernelRadius={1.5} maxDistance={1.5} />
      </Effects> */}
    </>
  )
}

// blendFunction?: BlendFunction;
// samples?: number;
// rings?: number;
// distanceThreshold?: number;
// distanceFalloff?: number;
// rangeThreshold?: number;
// rangeFalloff?: number;
// luminanceInfluence?: number;
// radius?: number;
// scale?: number;
// bias?: number;
// intensity?: number;
// color?: string;

// {/* <Bloom luminanceThreshold={0.1} intensity={0.5} levels={5} mipmapBlur /> */}
// {/* <Kaleidoscope u_symmetryPoints={2} /> */}
// {/* <RenderPass /> */}
// {/* <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} /> */}
// {/* <Glitch delay={[4.1, 8.1]} duration={[0.2, 0.5]} strength={[0.1, 0.4]} perturbationMap={null} /> */}
// {/* <Noise /> */}
// {/* <SSAO kernelRadius={0.5} maxDistance={0.1} /> */}
// {/* <unrealBloomPass threshold={0.9} strength={0.75} radius={0.5} /> */}
// {/* <DepthOfField target={[8, 0.1, -12]} height={480} focusRange={10} bokehScale={8} /> */}
