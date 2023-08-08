import * as THREE from 'three'
import React, { useEffect, useState } from 'react'
import { useRef, useMemo, useLayoutEffect } from 'react'
import niceColors from 'nice-color-palettes'
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
  shaderMaterial
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useSprings } from '@react-spring/three'

import mapRange from '../../utils/mapRange'
import shuffleArray from '../../utils/shuffleArray'
import useInterval from '../../utils/useInterval'

import { Canvas, extend, useThree } from '@react-three/fiber'
import { DepthOfField, Glitch, EffectComposer, Bloom, Noise, SSAO, SelectiveBloom } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
import { Symmetry } from '../../shader/Symmetry'
import { Kaleidoscope } from '../../shader/Kaleidoscope'
import { Frame } from '../../shader/Frame'
import { Line } from '../../shader/Line'
import { Glitches } from '../../shader/Glitches'

const Lines = ({ settings, position }) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const meshRef = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()

  const spotLightRef = useRef()
  // const geom = useMemo(() => new BoxGeometry(), [])
  // <spotLight ref={spotLightRef} intensity={1} position={[0, 50, 0]} />

  const ambientLightRef = useRef()
  const threeRef = useThree()

  const tempObject = new THREE.Object3D()
  useEffect(() => {
    setIsLoaded(true)
  }, [settings])

  useFrame((state) => {
    if (isLoaded) {
      const time = state.clock.getElapsedTime()

      let numberOfMaterialsIndexes = [...Array(settings.numberOfMaterials.length).keys()].map((i) => {
        return 0
      })

      for (let line = 0; line < settings.lines; line++) {
        for (let row = 0; row < settings.rows; row++) {
          let initialScaleFactor = mapRange((line + row * settings.rows * time) / 1000, 0, 10, 0, 1)
          if (initialScaleFactor > 1) {
            initialScaleFactor = 1
          }
          const lineSettings = settings.linesSettings[line]
          const noise2DValue = settings.noise3D(-row / 32 + time / 4, line / settings.noiseImpact, time / 8)
          let scale = mapRange(noise2DValue, 0.2, 1, 0, 1)

          if (scale <= 0.05) {
            scale = 0
          }

          let newX = (row + time * lineSettings.speed) % settings.lines
          let newZ = settings.isCurved ? settings.noise3D(newX / settings.curveNoiseSize, line / settings.curveNoiseSize, 0) * settings.curveIntensity : 0

          if (settings.areWavesHoritontal) tempObject.position.set(newX + lineSettings.offset * 3, newZ, line)
          else tempObject.position.set(newX + lineSettings.offset * 3, 0, line + newZ)

          tempObject.scale.set(scale * initialScaleFactor, scale * initialScaleFactor, scale * initialScaleFactor)
          tempObject.updateMatrix()

          if (lineSettings.materials[row] === 0) {
            meshRef.current.setMatrixAt(numberOfMaterialsIndexes[0], tempObject.matrix)
            numberOfMaterialsIndexes[0]++
            // meshRef.current.setMatrixAt(row + line * settings.lines, tempObject.matrix)
          } else if (lineSettings.materials[row] === 1) {
            meshRef2.current.setMatrixAt(numberOfMaterialsIndexes[1], tempObject.matrix)
            numberOfMaterialsIndexes[1]++
            // meshRef2.current.setMatrixAt(row + line * settings.lines, tempObject.matrix)
          } else if (lineSettings.materials[row] === 2) {
            meshRef3.current.setMatrixAt(numberOfMaterialsIndexes[2], tempObject.matrix)
            numberOfMaterialsIndexes[2]++
            // meshRef3.current.setMatrixAt(row + line * settings.lines, tempObject.matrix)
          }
        }
      }
      // console.log(numberOfMaterialsIndexes)
      meshRef.current.instanceMatrix.needsUpdate = true
      meshRef2.current.instanceMatrix.needsUpdate = true
      meshRef3.current.instanceMatrix.needsUpdate = true
    }
  })

  // const shape =
  //   settings.shape === 1 ? (
  //     <boxGeometry args={settings.cubeSize} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
  //       <instancedBufferAttribute attach="attributes-color" args={[settings.cubeColors, 3]} />
  //     </boxGeometry>
  //   ) : (
  //     <cylinderGeometry args={[settings.cubeSize[0] / 2, settings.cubeSize[1] / 2, settings.cubeSize[2], 16]}>
  //       <instancedBufferAttribute attach="attributes-color" args={[settings.cubeColors, 3]} />
  //     </cylinderGeometry>
  //   )
  // DEFINE SHAPE

  // const shape = new THREE.BoxGeometry(...settings.cubeSize)

  // {shape === 1 ? (
  //   <boxGeometry args={settings.cubeSize} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
  //     <instancedBufferAttribute attach="attributes-color" args={[settings.cubeColors, 3]} />
  //   </boxGeometry>
  // ) : (
  //   <cylinderGeometry args={[settings.cubeSize[0] / 2, settings.cubeSize[1] / 2, settings.cubeSize[2], 16]}>
  //     <instancedBufferAttribute attach="attributes-color" args={[settings.cubeColors, 3]} />
  //   </cylinderGeometry>
  // )}

  return (
    <group position={position}>
      {console.log('lines rendered')}
      <spotLight ref={spotLightRef} intensity={1} position={[0, 50, 0]} />
      <ambientLight ref={ambientLightRef} intensity={0.75} />
      {/* <Environment preset="city" /> */}

      <group position={[-settings.lines / 2, -0.5, -settings.rows / 2]}>
        <instancedMesh ref={meshRef} args={[null, null, settings.numberOfMaterials[0]]}>
          <boxGeometry args={settings.cubeSize}>
            <instancedBufferAttribute attach="attributes-color" args={[settings.cubesColors, 3]} />
          </boxGeometry>
          {/* <cylinderGeometry args={[settings.cubeSize[0] / 2, settings.cubeSize[1] / 2, settings.cubeSize[2], 16]}>
              <instancedBufferAttribute attach="attributes-color" args={[settings.cubeColors, 3]} />
            </cylinderGeometry> */}
          <meshLambertMaterial vertexColors toneMapped={true} />
        </instancedMesh>
        <instancedMesh ref={meshRef2} args={[null, null, settings.numberOfMaterials[1]]}>
          <boxGeometry args={settings.cubeSize}>
            <instancedBufferAttribute attach="attributes-color" args={[settings.cubesColors, 3]} />
          </boxGeometry>
          <meshLambertMaterial wireframe vertexColors toneMapped={true} fog={false} />
        </instancedMesh>
        <instancedMesh ref={meshRef3} args={[null, null, settings.numberOfMaterials[2]]}>
          <boxGeometry args={settings.cubeSize}>
            <instancedBufferAttribute attach="attributes-color" args={[settings.cubesColors, 3]} />
          </boxGeometry>
          <meshStandardMaterial color={settings.colors[5]} emissive={settings.colors[5]} emissiveIntensity={2} toneMapped={true} fog={false} />
        </instancedMesh>
      </group>

      {/* <instancedMesh ref={meshRef} args={[null, null, length]}>
        {shape === 1 ? (
          <boxGeometry args={size} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </boxGeometry>
        ) : (
          <cylinderGeometry args={[size[0] / 2, size[1] / 2, size[2], 16]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </cylinderGeometry>
        )}
        <meshLambertMaterial vertexColors toneMapped={false} />
      </instancedMesh> */}

      <EffectComposer>
        <Symmetry u_force={settings.symmetry} />
        <Frame />
        <Line />
        {/* <Glitches
          forms={[
            [0, 1, 1, 2],
            [0, 1, 1, 2]
          ]}
        /> */}
        <SelectiveBloom
          lights={[spotLightRef]} // ⚠️ REQUIRED! all relevant lights
          selection={[meshRef3]} // selection of objects that will have bloom effect
          selectionLayer={10} // selection layer
          intensity={1} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          width={threeRef.size.width} // render width
          height={threeRef.size.height} // render height
          kernelSize={4} // blur kernel size
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        />
        {/* <Kaleidoscope u_symmetryPoints={16} /> */}
        {/* <Glitch delay={[5, 5]} duration={[10, 10]} strength={[0.02, 0.02]} perturbationMap={null} /> */}
      </EffectComposer>
    </group>
  )
}

export default Lines
