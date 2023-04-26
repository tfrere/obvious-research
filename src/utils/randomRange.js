const randomRange = (min = 0, max = 100) => {
  let difference = max - min
  let rand = Math.random()
  rand = rand * difference
  rand = rand + min
  return rand
}

export default randomRange
