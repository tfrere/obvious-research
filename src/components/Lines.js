import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { a, useSpring, easings } from '@react-spring/three'
import { CameraShake, Shadow, Html, Cone, Line, QuadraticBezierLine, Segment, Segments, Sphere, Text } from '@react-three/drei'

import useInterval from '../utils/useInterval'

// import { vshader, fshader } from './shaders/stroke/shader.js'
import '../shaders/OutlineMaterial'

export function DashedCircle({ ...props }) {
  const lineRef = useRef()
  const points = []

  var items = props.items || 8
  var radius = props.radius ? props.radius : 5
  var center = [0, 0]
  for (var i = 0; i <= items; i++) {
    var x = center[0] + radius * Math.cos((2 * Math.PI * i) / items)
    var y = center[1] + radius * Math.sin((2 * Math.PI * i) / items)
    points.push(new THREE.Vector3(x, 0, y))
  }

  useFrame((_, delta) => {
    if (props.isLeft) lineRef.current.material.uniforms.dashOffset.value -= delta * props.speed
    else lineRef.current.material.uniforms.dashOffset.value += delta * props.speed
  })

  return <Line ref={lineRef} points={points} color={props.color ? props.color : 'white'} dashOffset={5} lineWidth={2} dashed={true} {...props} />
}

export function ContinuousCircle({ ...props }) {
  const lineRef = useRef()
  const points = []

  var items = 8
  var radius = props.radius ? props.radius : 5
  var center = [0, 0]
  for (var i = 0; i <= items; i++) {
    var x = center[0] + radius * Math.cos((2 * Math.PI * i) / items)
    var y = center[1] + radius * Math.sin((2 * Math.PI * i) / items)
    points.push(new THREE.Vector3(x, 0, y))
  }

  return <Line ref={lineRef} points={points} color={'white'} lineWidth={2} dashed={false} {...props} />
}
