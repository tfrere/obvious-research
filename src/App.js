import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { randomSnap } from '@georgedoescode/generative-utils'
import { Loader, Stats, Float, Edges, Environment, OrbitControls, useTexture, Reflector } from '@react-three/drei'
import { DepthOfField, Glitch, EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute, RenderPass } from 'postprocessing'
import { Perf } from 'r3f-perf'

import InstanciatedLine from './components/InstanciatedLine'

import Settings from './Settings'
import { Scene } from './components/Scene'

import { Symmetry } from './shader/Symmetry'
import { Frame } from './shader/Frame'
import { Line } from './shader/Line'

export const App = () => {
  const [settings, setSettings] = useState(new Settings(386))

  const updateSettings = () => {
    const newSeed = 386
    const newSettings = new Settings(newSeed)
    setSettings(newSettings)
  }
  useState(() => {
    updateSettings()
  }, [settings])

  return (
    <div className={`screen scanlines`}>
      <Scene settings={settings} />
      <Loader />
      <div className="title-block">
        <h1>YET ANOTHER</h1>
        <h2> GENERATOR</h2>
        <h3>S-{settings.seed}</h3>
      </div>
      <button
        className="button"
        onClick={() => {
          updateSettings()
        }}>
        Randomize
      </button>
    </div>
  )
}
