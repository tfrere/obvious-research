import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector } from '@react-three/drei'

import Settings from './Settings'
import { Scene } from './components/Scene'
import { MousePosition } from './components/MousePosition'

import { ReactComponent as Logo } from './public/obvious-research-logo.svg'

const createSeed = () => {
  return Math.floor(Math.random() * 1000)
}

export const App = () => {
  // const [debug, setDebug] = useState(false)
  const debug = true
  // const [debugPerf, setDebugPerf] = useState(false)
  const debugPerf = false

  const defaultSeed = 478

  // 516 522
  const [settings, setSettings] = useState(new Settings(!debug ? defaultSeed : createSeed(), debug, debugPerf))
  const [isUpdated, setIsUpdated] = useState(false)

  const updateSettings = (seed = -1) => {
    if (!isUpdated) {
      setIsUpdated(true)
      window.setTimeout(() => {
        const newSettings = new Settings(seed != -1 ? seed : createSeed(), debug, debugPerf)
        setSettings(newSettings)
      }, 250)
      window.setTimeout(() => {
        setIsUpdated(false)
      }, 500)
    }
  }

  // debug activable sur keypress ?
  // const isDebugPressed = useKeyPress('d')

  useEffect(() => {
    // setDebug(!debug)
    updateSettings(defaultSeed)
    // const newSettings = new Settings(defaultSeed, debug, debugPerf)
    // setSettings(newSettings)
  }, [])

  const formatSeed = (seed) => {
    return ('000' + seed).slice(-3)
  }

  return (
    <div className={`screen scanlines`}>
      <Scene settings={settings} />
      <Loader />
      <div className="screen ">
        <Logo className="logo" />
        <div className="ui-bottom">
          <h1 className="title">
            Challenging the narrative,
            <br /> we're the artists of tomorrow's technology
          </h1>
          <h4 className="coming-soon">Coming soon...</h4>
        </div>
      </div>
      {/* <div className="title-block ">
        <h1 className="">WORKING ON</h1>
        <h2 className=""> REPETITION</h2>
        <h3 className="">inspired by Samsy</h3>
      </div>
      <div className="info-block  ">
        <div id="color-scheme-container">
          {settings.colors.map((color, index) => {
            return <div key={color} className="box" style={{ backgroundColor: color }}></div>
          })}
        </div>
      </div>
      <div className="button-block ">
        <h3 className="">
          SEED {formatSeed(settings.seed)}
        </h3>
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
      </div> */}
    </div>
  )
}

{
  /* | C-{settings.colorSchemeIndex} */
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
