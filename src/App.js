import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { randomSnap } from '@georgedoescode/generative-utils'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector } from '@react-three/drei'
import { DepthOfField, Glitch, EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
import { Perf } from 'r3f-perf'

import Settings from './Settings'
import { Scene } from './components/Scene'
import { MousePosition } from './components/MousePosition'
import useSound from 'use-sound'

import popDownSound from './sounds/pop-down.mp3'

import { useControls } from 'leva'

import useKeyPress from './utils/useKeyPress'

const createSeed = () => {
  return Math.floor(Math.random() * 1000)
}

export const App = () => {
  const [playbackRate, setPlaybackRate] = useState(0.75)
  const [play] = useSound(popDownSound, { playbackRate, volume: 0.1 })

  // const [debug, setDebug] = useState(false)
  const debug = false
  // const [debugPerf, setDebugPerf] = useState(false)
  const debugPerf = false

  const defaultSeed = 478

  // 516 522
  const [settings, setSettings] = useState(new Settings(!debug ? defaultSeed : createSeed(), debug, debugPerf))
  const [isUpdated, setIsUpdated] = useState(false)

  const updateSettings = (seed = -1) => {
    if (!isUpdated) {
      const newSettings = new Settings(seed != -1 ? seed : createSeed(), debug, debugPerf)
      setSettings(newSettings)

      // boucle de timeout qui decrease jusqu'a s'arreter
      setIsUpdated(true)
      setSettings(new Settings(seed != -1 ? seed : createSeed(), debug, debugPerf))

      setPlaybackRate(0.75)
      play()
      setIsUpdated(false)
    }
  }

  // debug activable sur keypress ?
  // const isDebugPressed = useKeyPress('d')

  useEffect(() => {
    // setDebug(!debug)
    updateSettings(defaultSeed)
  }, [])

  const formatSeed = (seed) => {
    return ('000' + seed).slice(-3)
  }

  return (
    <div className={`screen scanlines`}>
      <Scene settings={settings} />
      <Loader />
      {/* <div className="centered-title-block ">
        <h1 className="">Challenging the narrative, we're the artists of tomorrow's technology</h1>
      </div> */}
      <div className="title-block ">
        <h1 className="">WORKING ON</h1>
        <h2 className=""> REPETITION</h2>
      </div>
      <div className="info-block  ">
        <div id="color-scheme-container">
          {settings.colors.map((color, index) => {
            return <div key={color} className="box" style={{ backgroundColor: color }}></div>
          })}
        </div>
      </div>
      <div className="button-block ">
        <h2 className="">
          S-{formatSeed(settings.seed)} | C-{settings.colorSchemeIndex}
        </h2>
        <button
          className={`button ${isUpdated ? ' shaky' : ''}`}
          onClick={() => {
            updateSettings()
          }}>
          Randomize
        </button>
      </div>
      <div className="mouse-position-block  ">
        <MousePosition />
      </div>
    </div>
  )
}

// import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
// import * as THREE from 'three'
// import { Canvas, useFrame, extend } from '@react-three/fiber'
// import { randomSnap } from '@georgedoescode/generative-utils'
// import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector } from '@react-three/drei'
// import { DepthOfField, Glitch, EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
// import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
// import { Perf } from 'r3f-perf'

// import Settings from './Settings'
// import { Scene } from './components/Scene'

// import { useControls } from 'leva'

// const createSeed = () => {
//   return Math.floor(Math.random() * 1000)
// }

// export const App = () => {
//   const { debugPerf, debug, seed, totalCubes, size } = useControls({
//     debugPerf: false,
//     debug: false,
//     seed: {
//       value: 4,
//       min: 0,
//       max: 1000,
//       step: 1
//     },
//     totalCubes: {
//       value: 150,
//       min: 0,
//       max: 150,
//       step: 1
//     },
//     size: {
//       value: 1,
//       min: 0,
//       max: 1,
//       step: 0.1
//     }
//   })

//   // 516 522
//   // (seed=0, debug = false, debugPerf = true, size = 1, rows = 150, lines = 150)

//   const [settings, setSettings] = useState(new Settings(seed, debug, debugPerf, size, totalCubes, totalCubes))

//   const updateSettings = () => {
//     const newSettings = new Settings(seed, debug, debugPerf, size, totalCubes, totalCubes)
//     setSettings(newSettings)
//   }

//   useEffect(() => {
//     updateSettings()
//   }, [debugPerf, debug, seed, totalCubes, size])

//   return (
//     <div className={`screen scanlines`}>
//       <Scene settings={settings} />
//       <Loader />
//       {!settings.debug && (
//         <>
//           <div className="title-block">
//             <h1>YET ANOTHER</h1>
//             <h2> GENERATOR</h2>
//             <h3>S-{settings.seed}</h3>
//           </div>
//           <button
//             className="button"
//             onClick={() => {
//               updateSettings()
//             }}>
//             Randomize
//           </button>
//           <div className="color-scheme"></div>
//         </>
//       )}
//     </div>
//   )
// }
