import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'

import Lines from './Lines/Lines'

import Ground from './Ground'

const calculateDistance = (x1, y1, z1, x2, y2, z2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
  return distance
}

export const Waves = ({ settings }) => {
  const orbitControlRef = useRef()
  const fogRef = useRef()
  const threeRef = useThree()

  useEffect(() => {
    threeRef.clock.start()
    threeRef.camera.position.set(settings.camera.position[0], settings.camera.position[1], settings.camera.position[2])
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

  return (
    <>
      <color attach="background" args={[settings.backgroundColor]} />
      <OrbitControls ref={orbitControlRef} {...settings.orbitControlConfig} />

      {console.log('stage rendered')}
      <Lines settings={settings} position={[0, 0, 0]} />
      {/* <Lines settings={settings} position={[0, 1, 0]} />
      <Lines settings={settings} position={[0, 2, 0]} /> */}
      <Ground settings={settings} speed={1} />
      {/* <Sphere args={[1, 100, 100]} position={[0, 5, 0]} scale={[10, 10, 10]}>
        <MeshDistortMaterial color={settings.colors[0]} speed={1} distort={1} radius={1} />
      </Sphere> */}

      {!settings.debug && <fog ref={fogRef} attach="fog" args={settings.fog} />}
      {settings.debugPerf && <Perf position="bottom-right" />}
    </>
  )
}

// {/* <Bloom luminanceThreshold={0.1} intensity={0.5} levels={5} mipmapBlur /> */}
// {/* <Kaleidoscope u_symmetryPoints={2} /> */}
// {/* <RenderPass /> */}
// {/* <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} /> */}
// {/* <Glitch delay={[4.1, 8.1]} duration={[0.2, 0.5]} strength={[0.1, 0.4]} perturbationMap={null} /> */}
// {/* <Noise /> */}
// {/* <SSAO kernelRadius={0.5} maxDistance={0.1} /> */}
// {/* <unrealBloomPass threshold={0.9} strength={0.75} radius={0.5} /> */}
// {/* <DepthOfField target={[8, 0.1, -12]} height={480} focusRange={10} bokehScale={8} /> */}
