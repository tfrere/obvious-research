import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { Canvas, Camera } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Waves } from './Waves'

export const Scene = ({ settings }) => {
  const [dpr, setDpr] = useState(2)

  return (
    <Canvas
      performance={{ min: 0.5 }}
      gl={{ physicallyCorrectColors: true }}
      dpr={[1.5, 1.5]}
      camera={settings.camera}
      resize={{ scroll: true, debounce: { scroll: 50, resize: 50 } }}>
      <PerformanceMonitor
        flipflops={3}
        onFallback={() => {
          console.log(dpr)
          setDpr(1)
        }}
      />
      <Suspense fallback={null}>
        {console.log('scene rendered')}
        <Waves settings={settings} />
      </Suspense>
    </Canvas>
  )
}
