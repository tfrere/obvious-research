import * as THREE from 'three'
import React from 'react'
import { useRef, useMemo, useLayoutEffect } from 'react'
import niceColors from 'nice-color-palettes'

import { useFrame } from '@react-three/fiber'

import { useSprings } from '@react-spring/three'

import mapRange from '../utils/mapRange'

import useInterval from '../utils/useInterval'

import { Canvas, extend } from '@react-three/fiber'

export default function LineOfParticles({
  seed,
  colorPalette,
  noise3D,
  noise2D,
  index,
  materials,
  isRotated = false,
  offset = 0,
  speed = 0.3,
  length = 30,
  size = [0.9, 0.9, 0.9],
  maxSize = 2,
  shape = 0,
  position = [0, 0, 0]
}) {
  const ref = useRef()
  const colors = useMemo(
    () =>
      new Float32Array(
        Array.from({ length }, (item, index) => {
          return new THREE.Color().set(colorPalette[Math.floor(index % colorPalette.length)]).toArray()
        }).flat()
      ),
    [length]
  )

  const o = new THREE.Object3D()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    for (let x = 0; x < length; x++) {
      // o.rotation.set(Math.random(), Math.random(), Math.random())

      // WTF :)
      const noise2DValue = noise3D(-x / 16 + time / 4, index / 4, time / 2)
      let value = mapRange(noise2DValue, 0.2, 1, 0, 1)
      let newX = (x + offset + time * speed) % length

      o.position.set(newX + offset * 3, 0, 0)
      if (value <= 0.05) {
        value = 0
      }
      o.scale.set(value, value, value)
      o.rotation.set(0, isRotated ? Math.PI / 4 : 0, 0)
      o.updateMatrix()
      ref.current.setMatrixAt(x, o.matrix)
      if (materials[x] === 1) {
        ref.current.material.wireframe = true
        ref.current.material.needsUpdate = true
      } else {
        ref.current.material.wireframe = false
        ref.current.material.needsUpdate = true
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      <instancedMesh ref={ref} args={[null, null, length]}>
        {shape === 1 ? (
          <boxGeometry args={size} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </boxGeometry>
        ) : (
          <cylinderGeometry args={[size[0] / 2, size[1] / 2, size[2], 8]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </cylinderGeometry>
        )}
        [<meshLambertMaterial wireframe vertexColors toneMapped={false} />, <meshLambertMaterial vertexColors toneMapped={false} />]
      </instancedMesh>
    </group>
  )
}
