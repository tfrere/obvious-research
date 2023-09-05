import * as THREE from 'three'
import React, { useEffect, useState } from 'react'
import { useRef, useMemo, useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

import mapRange from '../utils/mapRange'
import { noise } from '../lib/simplex'

function checkIsInCircle(a, b, x, y, r) {
  var dist_points = (a - x) * (a - x) + (b - y) * (b - y)
  r *= r
  if (dist_points < r) {
    return true
  }
  return false
}

const LabSimplex = ({ settings, position }) => {
  const meshRef = useRef()
  const tempObject = new THREE.Object3D()
  const ambientLightRef = useRef()
  const threeRef = useThree()

  const sizeOfGrid = 120
  const grid = [...Array(sizeOfGrid ** 2).keys()].map((i) => {
    return { x: i % sizeOfGrid, y: Math.floor(i / sizeOfGrid) }
  })

  const initialScale = 0.5
  const scaleFactor = 30

  useFrame((state) => {
    const time = state.clock.getElapsedTime() / 5

    tempObject.scale.set(0, 0, 0)

    grid.map((coord, i) => {
      tempObject.scale.set(0, 0, 0)
      let angle = noise.simplex3(coord.x / scaleFactor, coord.y / scaleFactor, time) * Math.PI * 2
      let length = noise.simplex3(coord.x / scaleFactor, coord.y / scaleFactor, time) * 1.5
      const isInCircle = checkIsInCircle(coord.x, coord.y, sizeOfGrid / 2, sizeOfGrid / 2, sizeOfGrid / 2)

      const isInCircle2 = checkIsInCircle(coord.x, coord.y, sizeOfGrid / 2, sizeOfGrid / 2, 5)

      tempObject.position.set(coord.x, length * 10, coord.y)
      if (isInCircle) tempObject.scale.set(initialScale * 10 * mapRange(length, 0, 1, 1, 0.5), initialScale, mapRange(length, -1, 1, initialScale, 1) * 2)
      tempObject.rotation.set(0, angle, 0)
      meshRef.current.setMatrixAt(i, tempObject.matrix)
      tempObject.updateMatrix()
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      <group position={[-sizeOfGrid / 2, -0.5, -sizeOfGrid / 2]}>
        <instancedMesh castShadow receiveShadow ref={meshRef} args={[null, null, sizeOfGrid ** 2]}>
          <boxGeometry castShadow receiveShadow args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-color" args={[settings.cubesColors, 3]} />
          </boxGeometry>
          {/* settings.colors[settings.colors.length - 1] */}
          {/* <meshLambertMaterial vertexColors toneMapped={true} /> */}
          <meshLambertMaterial castShadow receiveShadow toneMapped={true} color={'subtlegrey'} />
        </instancedMesh>
      </group>
    </group>
  )
}

export default LabSimplex
