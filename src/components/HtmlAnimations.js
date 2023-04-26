import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Loader, Stats, Float, Edges, Environment, OrbitControls } from '@react-three/drei'
import { Glitch, EffectComposer, Bloom } from '@react-three/postprocessing'
import ConsoleGenerator from './ConsoleGenerator'

const HtmlAnimations = () => {
  const [text, setText] = useState('x: 0  y: 0')

  useEffect(() => {
    let test = new ConsoleGenerator()
    test.render()
    document.addEventListener('mousemove', runEvent)

    function runEvent(e) {
      e.preventDefault()
      setText(`x: ${e.offsetX}  y: ${e.offsetY}`)
    }
  }, [])

  return (
    <>
      <div className="html-overlay__console output-console"></div>
      <div className="html-overlay__mouse-infos mouse-infos">
        <p>{text}</p>
      </div>
    </>
  )
}

export default HtmlAnimations
