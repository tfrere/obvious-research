import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Edges, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'

import fract, { config } from './GlyphGenerator.js'
import useInterval from '../utils/useInterval.js'

var removeBlack = function (data, imageData, bufferctx) {
  for (var i = 0; i < data.length; i += 4) {
    if (data[i] + data[i + 1] + data[i + 2] < 500) {
      data[i + 3] = 0 // alpha
    }
  }
  bufferctx.putImageData(imageData, 0, 0)
}

const changeGlyphMode = (config, letter) => {
  if (letter === 'M') {
    config.angle = 24
    config.skewAngle = 6
    config.poly = 3
  }
  if (letter === 'A') {
    config.angle = 24
    config.skewAngle = 4.5
    config.poly = 2
  }
  if (letter === 'S') {
    config.angle = 142
    config.skewAngle = 12
    config.poly = 1
  }

  fract.set(config)
}

export default function Glyph(props) {
  const textureRef = useRef()
  const [currentGlyph, setCurrentGlyph] = useState('M')

  const updateGlyph = () => {
    //fract.al.render()
    var canvas = props.canvasPortalRef.current
    var buffer = document.createElement('canvas')
    buffer.width = canvas.width
    buffer.height = canvas.height
    var bufferctx = props.canvasPortalRef.current.getContext('2d')

    bufferctx.drawImage(new Image(canvas.width, canvas.height), 0, 0)

    var imageData = bufferctx.getImageData(0, 0, buffer.width, buffer.height)
    var data = imageData.data

    removeBlack(data, imageData, bufferctx)

    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  }

  useFrame(({ clock }) => {
    updateGlyph()
  })

  // useInterval(() => {}, 40)

  const randomGlyph = () => {
    let newGlyph = ''
    while (newGlyph === '' || newGlyph === currentGlyph) {
      const rand = Math.random()
      if (rand < 0.33) {
        newGlyph = 'A'
      } else if (rand < 0.66) {
        newGlyph = 'M'
      } else {
        newGlyph = 'S'
      }
    }
    changeGlyphMode(config, newGlyph)
    setCurrentGlyph(newGlyph)
  }

  const initFract = () => {
    fract.init(config)
    changeGlyphMode(config, 'A')
    fract.animate.toggle()
    fract.trails.toggle()
  }

  useEffect(() => {
    initFract()
  }, [])

  return (
    <mesh
      {...props}
      onClick={() => {
        randomGlyph()
      }}>
      <planeGeometry attach="geometry" args={[5, 5]} />
      <meshBasicMaterial transparent={true} side={THREE.DoubleSide}>
        <canvasTexture ref={textureRef} attach="map" image={props.canvasPortalRef.current} />
      </meshBasicMaterial>
    </mesh>
  )
}
