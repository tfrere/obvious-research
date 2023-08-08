import React, { Suspense, useMemo, useEffect, useRef, useState, forwardRef } from 'react'

export const MousePosition = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY
      })
    }
    window.addEventListener('mousemove', handleWindowMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [])
  return (
    <h3 className="mouse-position-block">
      {coords.x}, {coords.y}
    </h3>
  )
}
