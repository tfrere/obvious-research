import { Suspense, useMemo, useEffect, useRef, useState } from 'react'
import niceColors from 'nice-color-palettes'
import { seedPRNG, createVoronoiTessellation, random, randomBias, randomSnap, createNoiseGrid, map } from '@georgedoescode/generative-utils'

import { createNoise3D, createNoise2D } from 'simplex-noise'

import chroma from 'chroma-js'

// Background color, relativement saturé

// chroma.scale(['#fafa6e','#2A4858'])
//     .mode('lch').colors(6)

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = randomSnap(0, currentIndex, 1)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

class Settings {
  constructor(seed) {
    this.debug = false
    // 2 focus on shapes
    seedPRNG(seed)

    const shape = [0, 2]
    const size = 1
    const rows = 100
    const lineSize = 100

    const colors = [...niceColors[randomSnap(0, 100, 1)]]
    // console.log(colors)

    const noise3D = createNoise3D(() => {
      return random(0, 1)
    })
    const noise2D = createNoise2D(() => {
      return random(0, 1)
    })

    this.seed = seed
    if (this.debug) {
      this.camera = {
        position: [10, 50, 10],
        fov: 50
      }
      this.orbitControlConfig = {}
    } else {
      this.camera = {
        position: [randomSnap(0, 50, 1), 50, randomSnap(0, 50, 1)],
        fov: 50
      }
      this.orbitControlConfig = {
        enablePan: false,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 4,
        minDistance: 15,
        maxDistance: 50
      }
    }
    this.shape = randomSnap(shape[0], shape[1], 1)
    this.isCurved = randomSnap(0, 1, 1)
    this.curveIntensity = randomSnap(1, 4, 1)
    this.symmetry = !this.debug ? randomSnap(0, 2, 1) : 0
    this.size = [size, size, size]
    this.colors = colors
    this.backgroundColor = chroma(colors[0]).saturate(3).hex()
    this.fogColor = chroma(colors[0]).darken(2).saturate(3).hex()
    this.gridColor = '#F0F0'
    this.isRotated = randomSnap(0, 1, 1)
    this.noise3D = noise3D
    this.noise2D = noise2D
    this.rows = rows
    this.lineSize = lineSize

    // diviser rows en X blocs de Y lignes aléatoirement ( min : 3, max 7 )
    // entre deux et 4 blocs, de taille differente [le 1 est sous representé ]

    let blocSize = randomSnap(3, 8, 1)
    let currentIndex = 0
    let currentOffset = 5
    let currentSpeed = 1
    let currentIsVisible = 1
    let currentMaterials = [...Array(this.lineSize).keys()].map((item, index) => {
      return randomSnap(0, 2, 1)
    })
    let currentColors = shuffle(colors)

    this.lines = [...Array(this.rows).keys()].map((item, index) => {
      currentIndex++
      if (currentIndex === blocSize) {
        currentIndex = 0

        blocSize = randomSnap(1, 10, 1)
        currentOffset = random(0, 15)
        currentSpeed = randomBias(0, 5, 1, 0.6)
        currentColors = shuffle(colors)
        currentMaterials = [...Array(this.lineSize).keys()].map((item, index) => {
          return randomSnap(0, 2, 1)
        })
        if (blocSize <= 2) currentIsVisible = 0
        else currentIsVisible = 1
      }
      return {
        index: index,
        materials: currentMaterials,
        colorPalette: currentColors,
        offset: currentOffset,
        speed: currentSpeed + random(0, 0),
        isVisible: currentIsVisible
      }
    })
  }
}

export default Settings
