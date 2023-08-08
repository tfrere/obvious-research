import { seedPRNG, createVoronoiTessellation, random, randomBias, randomSnap, createNoiseGrid, map } from '@georgedoescode/generative-utils'

const shuffleArray = (array) => {
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

export default shuffleArray
