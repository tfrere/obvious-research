class ConsoleGenerator {
  constructor() {
    this.commandStart = ['Start recording ', 'Searching ', 'Analyzing ', 'Compressing ', 'Entering Location ', 'Downloading ']
    this.commandParts = ['Data Structure', 'Texture', 'TPS Reports', ' .... Searching ... ']
    this.commandResponses = [
      'Authorizing ',
      'Authorized...',
      'Access Granted..',
      'Compression Complete.',
      'Waiting for response...',
      'Calculating Space Requirements '
    ]
    this.isProcessing = false
    this.processTime = 0
    this.lastProcess = 0
    this.outputConsole = document.querySelector('.output-console')
  }

  render() {
    var textEl = document.createElement('p')

    if (this.isProcessing) {
      textEl = document.createElement('p')
      textEl.textContent = 'Vector : ' + Math.random()
      if (Date.now() > this.lastProcess + this.processTime) {
        this.isProcessing = false
      }
    } else {
      var commandType = ~~(Math.random() * 4)
      switch (commandType) {
        case 0:
          textEl.textContent = this.commandStart[~~(Math.random() * this.commandStart.length)] + this.commandParts[~~(Math.random() * this.commandParts.length)]
          break
        case 1:
          textEl.textContent = this.commandStart[~~(Math.random() * this.commandStart.length)] + this.commandParts[~~(Math.random() * this.commandParts.length)]
          break
        case 2:
          textEl.textContent = 'Vector : ' + Math.random()
          break
        case 3:
          this.isProcessing = true
          this.lastProcess = Date.now()
          textEl.textContent = this.commandResponses[~~(Math.random() * this.commandResponses.length)]
          break
        default:
          textEl.textContent = this.commandResponses[~~(Math.random() * this.commandResponses.length)]
          break
      }
    }

    this.outputConsole.scrollTop = this.outputConsole.scrollHeight
    this.outputConsole.appendChild(textEl)

    var removeNodes = this.outputConsole.querySelectorAll('*')
    if (removeNodes.length > 4) {
      this.outputConsole.removeChild(removeNodes[0])
    }

    setTimeout(this.render.bind(this), ~~(Math.random() * 2600))
    this.outputConsole.scrollTop = this.outputConsole.scrollHeight
  }
}

export default ConsoleGenerator
