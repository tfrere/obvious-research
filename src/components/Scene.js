import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Canvas, Camera } from '@react-three/fiber'
import { Stage } from './Stage'

export const Scene = ({ settings }) => {
  return (
    <Canvas shadows dpr={[1, 1]} camera={settings.camera} resize={{ scroll: true, debounce: { scroll: 50, resize: 50 } }}>
      <Suspense fallback={null}>
        <Stage settings={settings} />
      </Suspense>
    </Canvas>
  )
}
