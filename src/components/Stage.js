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
  MeshDistortMaterial
} from '@react-three/drei'
import { DepthOfField, Glitch, EffectComposer, Bloom, Noise, SSAO } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
import { Perf } from 'r3f-perf'

import InstanciatedLine from './InstanciatedLine'

import Ground from './Ground'

import { Symmetry } from '../shader/Symmetry'
import { Frame } from '../shader/Frame'
import { Line } from '../shader/Line'

export const Stage = ({ settings }) => {
  const orbitControlRef = useRef()
  const threeRef = useThree()

  useEffect(() => {
    threeRef.clock.start()
    threeRef.camera.position.set(settings.camera.position[0], settings.camera.position[1], settings.camera.position[2])
    threeRef.camera.lookAt([0, 0, 0])
  }, [settings])

  const lines = settings.lines.map((line) => {
    return (
      line.isVisible && (
        <InstanciatedLine
          debug={settings.debug}
          seed={settings.seed}
          noise3D={settings.noise3D}
          noise2D={settings.noise2D}
          length={settings.lineSize}
          size={settings.size}
          shape={settings.shape}
          curveIntensity={settings.curveIntensity}
          isCurved={settings.isCurved}
          isRotated={settings.isRotated}
          materials={line.materials}
          key={line.index}
          index={line.index}
          colorPalette={line.colorPalette}
          speed={line.speed}
          offset={line.offset}
          position={[-settings.lineSize / 2, -1, line.index - settings.lineSize / 2]}
        />
      )
    )
  })

  return (
    <>
      <color attach="background" args={[settings.backgroundColor]} />
      <OrbitControls ref={orbitControlRef} {...settings.orbitControlConfig} />
      <ambientLight intensity={1} />
      <spotLight intensity={0.5} position={[0, 50, 0]} />
      <Environment preset="city" />
      {/* <Sphere args={[1, 100, 100]} position={[0, 5, 0]} scale={[10, 10, 10]}>
        <MeshDistortMaterial wireframe color={settings.colors[0]} speed={1} distort={1} radius={1} />
      </Sphere> */}
      {lines}
      <Ground settings={settings} />

      {!settings.debug && <fog attach="fog" args={[settings.fogColor, , 125]} />}
      {settings.debug && <Perf />}

      <EffectComposer>
        <Symmetry u_force={settings.symmetry} />
        {!settings.debug && (
          <>
            <Frame />
            <Line />
          </>
        )}

        {/* <RenderPass /> */}
        {/* <Bloom luminanceThreshold={0.1} intensity={0.1} levels={5} mipmapBlur /> */}
        {/* <Glitch delay={[4.1, 8.1]} duration={[0.2, 0.5]} strength={[0.1, 0.4]} perturbationMap={null} /> */}
        {/* <Noise /> */}
        {/* <SSAO kernelRadius={0.5} maxDistance={0.1} /> */}
        {/*   <unrealBloomPass threshold={0.9} strength={0.75} radius={0.5} /> */}

        {/* <DepthOfField target={[8, 0.1, -12]} height={480} focusRange={10} bokehScale={8} /> */}
      </EffectComposer>
    </>
  )
}
