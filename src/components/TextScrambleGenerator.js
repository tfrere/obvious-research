export default class TextScrambleGenerator {
  constructor(currentText) {
    this.currentText = currentText
    this.chars = '!<>-_\\/[]—=+^#________' // '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
    this.setText = this.setText.bind(this)
    this.getCurrentText = this.getCurrentText.bind(this)
    this.frame = 0
  }
  setText(newText) {
    const oldText = this.currentText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 60)
      const end = start + Math.floor(Math.random() * 60)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.08) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `${char}`
      } else {
        output += from
      }
    }
    this.currentText = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  getCurrentText() {
    return this.currentText
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}
