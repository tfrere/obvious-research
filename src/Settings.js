import * as THREE from 'three'
import { seedPRNG, createVoronoiTessellation, random, randomBias, randomSnap, createNoiseGrid, map } from '@georgedoescode/generative-utils'
import { createNoise3D, createNoise2D } from 'simplex-noise'
import mapRange from './utils/mapRange'
import chroma from 'chroma-js'
import { getProbabilisticRandom, getProbabilisticRandomArray } from './utils/getProbabilisticRandom'
import { sortColorsBySaturation, sortColorsByLuminance, createMonochromePalette, createPalette } from './utils/colors'

class Settings {
  constructor(seed = 0, debug = false, debugPerf = true, size = 1, rows = 150, lines = 150) {
    seedPRNG(seed)

    this.debug = debug
    this.debugPerf = debugPerf

    const shape = [0, 2]
    const numberOfCubes = rows * lines
    const noise3D = createNoise3D(() => {
      return random(0, 1)
    })
    const noise2D = createNoise2D(() => {
      return random(0, 1)
    })

    // COLORS

    let palette = createPalette()
    let colors = palette.colors
    let colorSchemeIndex = palette.colorIndex

    while (chroma(colors[0]).luminance() > 0.4) {
      palette = createPalette()
      colors = palette.colors
      colorSchemeIndex = palette.colorIndex
    }

    // colors[0] = chroma(colors[0]).saturate(3).hex()
    // .set('hsl.h', '+180')
    let backgroundColor = chroma(colors[0]).brighten(2).saturate(2).hex()
    let fogColor = chroma(colors[0]).darken(2).saturate(3).hex()

    const colorWeights = [0.7, 0.1, 0.1, 0.05, 0.05]

    const colorDistributionWeights = [0.6, 0.2, 0.2]

    // let currentMaterials = [...Array(this.lines * this.rows).keys()].map((item, index) => {
    //   return getProbabilisticRandom(materialValues, materialWeights).item
    // })

    // COLOR DISTRIBUTION
    let meshColors = Array.from({ length: rows * lines }, (item, index) => {
      return colors[Math.floor(mapRange(noise2D(index / 10, (index % lines) / 10), -1, 1, 0, 5))]
      // return colors[index % colors.length]
      // return getProbabilisticRandom(colors, colorWeights).item
    })

    meshColors = meshColors.map((color) => {
      if (color === colors[0]) {
        return chroma(color)
          .set('hsl.s', '+' + randomSnap(0, 0.2, 0.05))
          .hex()
        // .set('hsl.l', '+' + randomSnap(0, 10, 0.1))
      }
      return color
    })

    // console.log('meshColors', meshColors)

    // INTERNAL

    this.seed = seed
    if (this.debug) {
      this.camera = {
        position: [10, 50, 10],
        fov: 50
      }
      this.orbitControlConfig = {}
    } else {
      this.camera = {
        position: [randomSnap(0, 50, 1), randomSnap(30, 50, 1), randomSnap(30, 50, 1)],
        fov: 50
      }
      this.orbitControlConfig = {
        enablePan: false,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 4,
        minDistance: 25,
        maxDistance: 75
      }
    }

    this.cubesColors = new Float32Array(
      [...Array(numberOfCubes).keys()]
        .map((item, index) => {
          return new THREE.Color().set(meshColors[index]).toArray()
        })
        .flat()
    )

    this.shape = randomSnap(shape[0], shape[1], 1)
    this.isCurved = randomSnap(0, 1, 1)
    this.areWavesHoritontal = randomSnap(0, 1, 1)
    this.curveIntensity = randomSnap(6, 10, 1)
    this.curveNoiseSize = 64
    this.noiseImpact = randomBias(4, 12, 8, 1)
    this.symmetry = !this.debug ? randomSnap(0, 2, 1) : 0
    this.cubeSize = [size, size, size]
    this.numberOfCubes = numberOfCubes
    this.colors = colors
    this.colorSchemeIndex = colorSchemeIndex
    console.log('this.colorSchemeIndex', this.colorSchemeIndex)
    this.meshColors = meshColors
    this.backgroundColor = backgroundColor
    this.fogColor = fogColor
    this.fog = [fogColor, 0, 120]
    this.gridColor = '#F0F0'
    this.isRotated = randomSnap(0, 1, 1)
    this.noise3D = noise3D
    this.noise2D = noise2D
    this.rows = rows
    this.lines = lines
    this.groundMaterialSettings = {
      blur: [3000, 100],
      resolution: 1024,
      mixBlur: 1000,
      depthScale: 2,
      minDepthThreshold: 0.01,
      maxDepthThreshold: 0.5,
      distortion: 3,
      distortionScale: 5.5,
      roughness: 1,
      metalness: 1,
      color: colors[0]
    }

    // diviser rows en X blocs de Y lignes aléatoirement ( min : 3, max 7 )
    // entre deux et 4 blocs, de taille differente [le 1 est sous representé ]

    let blocSize = randomSnap(3, 12, 1)
    let currentIndex = 0
    let currentOffset = 5
    let currentSpeed = 1
    let currentIsVisible = 1

    const materialWeights = [0.8, 0.15, 0.05]
    const materialValues = [0, 1, 2]

    let currentMaterials = getProbabilisticRandomArray(materialValues, materialWeights, this.lines * this.rows)

    let numberOfMaterials = [...Array(materialValues.length).keys()].map((item, index) => {
      return currentMaterials.filter((material) => material === item).length
    })

    this.numberOfMaterials = numberOfMaterials

    this.linesSettings = [...Array(this.rows).keys()].map((item, index) => {
      currentIndex++
      if (currentIndex === blocSize) {
        currentIndex = 0
        blocSize = randomSnap(3, 12, 1)
        currentOffset = random(0, 0)
        currentSpeed = randomBias(0, 5, 1, 0.6)
        // currentMaterials = getProbabilisticRandomArray(materialValues, materialWeights, this.lines)
        if (blocSize <= 2) currentIsVisible = 0
        else currentIsVisible = 1
      }

      currentMaterials = getProbabilisticRandomArray(materialValues, materialWeights, this.lines)
      return {
        index: index,
        materials: currentMaterials,
        colorPalette: colors,
        offset: currentOffset,
        speed: currentSpeed + random(0, 0),
        isVisible: currentIsVisible
      }
    })
  }
}

export default Settings
