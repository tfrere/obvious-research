import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useRef, useMemo, useLayoutEffect } from 'react'
import niceColors from 'nice-color-palettes'

import { useFrame } from '@react-three/fiber'

import { useSprings } from '@react-spring/three'

import mapRange from '../utils/mapRange'
import shuffleArray from '../utils/shuffleArray'
import useInterval from '../utils/useInterval'

import { Canvas, extend, useThree } from '@react-three/fiber'

function InstanciatedLine({
  seed,
  colorPalette,
  noise3D,
  noise2D,
  index,
  materials,
  meshColors,
  curveIntensity = 0,
  isCurved = false,
  isRotated = false,
  offset = 0,
  speed = 0.3,
  length = 30,
  size = [0.9, 0.9, 0.9],
  maxSize = 2,
  shape = 0,
  position = [0, 0, 0]
}) {
  const meshRef = useRef()
  const tempObject = new THREE.Object3D()
  const tempColor = new THREE.Color()

  // une ligne de couleurs continues
  // avec un wireframe et un bloom de temps en temps

  //   const colors = useMemo(
  //     () =>
  //       new Float32Array(
  //         Array.from({ length }, (item, index) => {
  //           return new THREE.Color().set(colorPalette[Math.floor(index % colorPalette.length)]).toArray()
  //         }).flat()
  //       ),
  //     [length]
  //   )

  const colors = new Float32Array(
    Array.from({ length }, (item, index) => {
      return new THREE.Color().set(meshColors[index]).toArray()
    }).flat()
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    for (let x = 0; x < length; x++) {
      // WTF :)
      let initialScaleFactor = mapRange(time * 10, 0, 10, 0, 1)
      if (initialScaleFactor > 1) {
        initialScaleFactor = 1
      }
      // WTF :)
      const noise2DValue = noise3D(-x / 32 + time / 4, index / 4, time / 2)
      let value = mapRange(noise2DValue, 0.2, 1, 0, 1)
      let newX = (x + offset + time * speed) % length
      let newZ = isCurved ? noise3D(x / 32, (x % length) / 16, 0) * curveIntensity : 0

      tempObject.position.set(newX + offset * 3, newZ, 0)
      if (value <= 0.05) {
        value = 0
      }
      tempObject.scale.set(value * initialScaleFactor, value * initialScaleFactor, value * initialScaleFactor)
      //   tempObject.scale.set(initialScaleFactor, initialScaleFactor, initialScaleFactor)
      //   tempObject.scale.set(value, value, value)

      tempObject.rotation.set(0, isRotated ? Math.PI / 4 : 0, 0)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(x, tempObject.matrix)
      //   if (materials[x] === 1) {
      //     meshRef.current.material.wireframe = true
      //     meshRef.current.material.needsUpdate = true
      //   } else {
      //     meshRef.current.material.wireframe = false
      //     meshRef.current.material.needsUpdate = true
      //   }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[null, null, length]}>
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
      </instancedMesh>
    </group>
  )
}

export const Lines = ({ settings }) => {
  return (
    <>
      {settings.lines.map((line) => {
        return (
          line.isVisible && (
            <InstanciatedLine
              debug={settings.debug}
              seed={settings.seed}
              noise3D={settings.noise3D}
              noise2D={settings.noise2D}
              length={settings.lineSize}
              size={settings.size}
              meshColors={settings.meshColors}
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
      })}
    </>
  )
}

export default Lines
