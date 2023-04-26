import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Segments, Segment, Text, Text3D, Float, Edges, Plane, MeshDistortMaterial } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'

import fract, { config } from './GlyphGenerator.js'
import TextScrambleGenerator from './TextScrambleGenerator.js'
import useInterval from '../utils/useInterval.js'

const generator = new TextScrambleGenerator("DON'T TRUST YOUR EYES")

const TextScramble = (props) => {
  const phrases = ["DON'T TRUST YOUR EYES", 'SEEK THE UNS=EN', 'JOIN THE R3VOLUTION'] // , 'CONNECT THE DOTS'
  const [currentDots, setCurrentDots] = useState('...')
  const [currentText, setCurrentText] = useState("DON'T TRUST YOUR EYES")
  const [fontSize, setFontSize] = useState(0.4)

  useFrame(() => {
    const width = window.innerWidth

    if (width < 400) {
      setFontSize(0.22)
    } else if (width < 768) {
      setFontSize(0.27)
    } else {
      setFontSize(0.4)
    }
  })

  useInterval(() => {
    setCurrentText(generator.getCurrentText())
  }, 60)

  useInterval(() => {
    if (currentDots.length === 3) {
      setCurrentDots('.')
    } else {
      setCurrentDots(currentDots + '.')
    }
  }, 400)

  useEffect(() => {
    let counter = 0
    const next = () => {
      generator.setText(phrases[counter]).then(() => {
        setTimeout(next, 3200)
      })
      counter = (counter + 1) % phrases.length
    }

    next()
  }, [])

  return (
    <>
      <Text
        anchorY="middle"
        anchorX="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        textAlign={'left'}
        letterSpacing={0.02}
        lineHeight={1}
        maxWidth={30}
        fontSize={fontSize}
        outlineOffsetX={'5%'}
        outlineOffsetY={'5%'}
        outlineBlur={'0%'}
        outlineOpacity={1}
        outlineColor="#FF0000"
        position={[0, 0.24, 2.2]}>
        <meshBasicMaterial side={THREE.DoubleSide} color={'white'} transparent />
        {currentText}
      </Text>
      <Text
        anchorY="left"
        anchorX="left"
        font="https://themes.googleusercontent.com/static/fonts/sourcecodepro/v4/mrl8jkM18OlOQN8JLgasDxM0YzuT7MdOe03otPbuUS0.woff"
        textAlign={'left'}
        letterSpacing={0.02}
        lineHeight={0.1}
        fontSize={0.12}
        maxWidth={30}
        position={[-0.85, -0.75, 1]}>
        <meshBasicMaterial side={THREE.DoubleSide} color={'white'} transparent />
        coming soon{currentDots}
      </Text>
    </>
  )
}

export default TextScramble
