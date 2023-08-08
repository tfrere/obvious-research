import * as THREE from 'three'
import { Suspense, useMemo, useEffect, useRef, useState } from 'react'
import niceColors from './color-list/100.json'
import { seedPRNG, createVoronoiTessellation, random, randomBias, randomSnap, createNoiseGrid, map } from '@georgedoescode/generative-utils'
import { randomLcg, randomNormal, randomGeometric } from 'd3-random'

import { createNoise3D, createNoise2D } from 'simplex-noise'

import shuffleArray from './shuffleArray'
import mapRange from './mapRange'

import chroma from 'chroma-js'

99, 91, 63

export const sortColorsBySaturation = (colors, isAscend = True) => {
  return colors.sort((color1, color2) => {
    const saturation1 = chroma(color1).get('hsl.s')
    const saturation2 = chroma(color2).get('hsl.s')
    if (isAscend) return saturation1 - saturation2
    else return saturation1 + saturation2
  })
}

export const sortColorsByLuminance = (colors, isAscend = True) => {
  return colors.sort((color1, color2) => {
    const luminance1 = chroma(color1).get('hsl.l')
    const luminance2 = chroma(color2).get('hsl.l')
    if (isAscend) return luminance1 - luminance2
    else return luminance1 + luminance2
  })
}

export const createMonochromePalette = () => {
  // Main color, a lot of saturaiton and lightness
  let mainColor = chroma({
    h: randomSnap(0, 360, 1),
    s: randomSnap(0.6, 1, 0.1),
    l: randomSnap(0.5, 0.75, 0.1)
  })

  // Complement color, as background
  let complementColor = chroma(mainColor).set('hsl.h', '+180')

  let colors = chroma
    .scale([mainColor, mainColor.set('hsl.h', '+90')])
    .mode('lch')
    .colors(5)

  return colors
}

export const createPalette = () => {
  let colorIndex = randomSnap(0, 100, 1)
  return { colors: sortColorsByLuminance([...niceColors[colorIndex]], false), colorIndex: colorIndex }
}
