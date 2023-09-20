import * as THREE from 'three'
import React, { useEffect, useState } from 'react'
import { useRef, useMemo, useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

import mapRange from '../utils/mapRange'
import { noise } from '../lib/simplex'
import { useSpring, animated } from '@react-spring/three'
import { useControls } from 'leva'

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
  // const [scaleFactor, setScaleFactor] = useState(10)
  const { scaleFactor, timeFactor, initialScale, yScale, wireframe } = useControls({
    scaleFactor: {
      value: 15,
      min: 0,
      max: 60,
      step: 0.01
    },
    timeFactor: {
      value: 5,
      min: 0,
      max: 60,
      step: 0.01
    },
    initialScale: {
      value: 0.1,
      min: 0,
      max: 10,
      step: 0.1
    },
    yScale: {
      value: 20,
      min: 0,
      max: 50,
      step: 1
    },
    wireframe: false
  })

  const sizeOfGrid = 55
  const grid = [...Array(sizeOfGrid ** 2).keys()].map((i) => {
    return { x: i % sizeOfGrid, y: Math.floor(i / sizeOfGrid) }
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime() / timeFactor

    tempObject.scale.set(0, 0, 0)

    grid.map((coord, i) => {
      tempObject.scale.set(0, 0, 0)
      let angle = noise.simplex3(coord.x / scaleFactor, coord.y / scaleFactor, time) * Math.PI * 2
      let length = noise.simplex3(coord.x / scaleFactor, coord.y / scaleFactor, time) * 1.5
      const isInCircle = checkIsInCircle(coord.x, coord.y, sizeOfGrid / 2, sizeOfGrid / 2, sizeOfGrid / 2)

      const isInCircle2 = checkIsInCircle(coord.x, coord.y, sizeOfGrid / 2, sizeOfGrid / 2, 0)

      tempObject.position.set(coord.x, length * yScale, coord.y)
      if (isInCircle)
        tempObject.scale.set(
          initialScale * yScale * mapRange(length, 0, 1, 1, 0.5),
          initialScale * yScale * mapRange(length, 0, 1, 1, 0.5),
          initialScale * yScale * mapRange(length, 0, 1, 1, 0.5)
        )
      // tempObject.rotation.set(0, angle, 0)
      meshRef.current.setMatrixAt(i, tempObject.matrix)
      tempObject.updateMatrix()
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position} scale={[0.8, 0.8, 0.8]}>
      <group position={[-sizeOfGrid / 2, -0.5, -sizeOfGrid / 2]}>
        <instancedMesh castShadow receiveShadow ref={meshRef} args={[null, null, sizeOfGrid ** 2]}>
          <sphereGeometry castShadow receiveShadow args={[1, 12, 12]}>
            <instancedBufferAttribute attach="attributes-color" args={[settings.cubesColors, 3]} />
          </sphereGeometry>
          {/* settings.colors[settings.colors.length - 1] */}
          <meshLambertMaterial wireframe={wireframe} toneMapped={true} color={'#000'} />
          {/* <meshLambertMaterial toneMapped={true} color={'#310480'} /> */}
        </instancedMesh>
      </group>
    </group>
  )
}

export default LabSimplex
