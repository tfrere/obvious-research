import $ from 'jquery'
import gsap from 'gsap'

// Helpers
function getScale(diffX, diffY) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
  return Math.min(distance / 800, 0.15)
}

function getAngle(diffX, diffY) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI
}

/**
 * debounce function
 * use inDebounce to maintain internal reference of timeout to clear
 */
const debounce = (func, delay) => {
  let inDebounce
  return function () {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

export default class Cursor {
  constructor(options) {
    this.options = $.extend(
      true,
      {
        container: 'body',
        speed: 0.65,
        ease: 'expo.out',
        visibleTimeout: 300
      },
      options
    )
    this.mediaTimeout = null
    this.linkTimeout = null
    this.body = $(this.options.container)
    this.hasToScale = false
    this.isMobile = false
    this.el = $('<div class="cursor"></div>')
    this.elCircle = $('<div class="cursor-circle"></div>')
    this.text = $('')
    this.video = $('')
    this.oldTarget = null
    this.pos = { x: 0, y: 0 }
    this.oldPos = { x: 0, y: 0 }
    this.vel = { x: 0, y: 0 }

    this.init()
  }

  init() {
    this.el.append(this.elCircle)
    this.body.append(this.el)
    this.bind()
    this.computeResize()
    this.hide()
    this.frameLoop()
  }

  bind() {
    const self = this
    let showDebounce = debounce(this.mouseMove({ clientX: -300, clientY: -300 }), 100)

    this.body
      .on('resize', () => {
        self.computeResize()
      })
      .on('mouseleave', () => {
        self.hide()
      })
      .on('mouseenter', () => {
        self.show()
      })
      .on('mousemove', (e) => {
        showDebounce = debounce(this.mouseMove(e), 1000 / 40)
      })
      .on('mousedown', () => {
        self.setState('-active')
      })
      .on('mouseup', () => {
        self.removeState('-active')
      })
      .on('mouseup', '[data-cursor-link]', (event) => {
        $(this.elCircle).removeClass('-holding')
        clearTimeout(this.linkTimeout)
      })
      .on('mouseleave', '[data-cursor-link]', () => {
        $(this.elCircle).removeClass('-holding')
        clearTimeout(this.linkTimeout)
      })
      .on('click', '[data-cursor-link]', (event) => {
        // if (!this.isMobile) {
        //   event.stopPropagation()
        //   event.preventDefault()
        // }
      })
      .on('mouseenter', 'iframe', () => {
        self.hide()
      })
      .on('mouseleave', 'iframe', () => {
        self.show()
      })
      .on('mouseenter', '[data-cursor]', function () {
        self.setState(this.dataset.cursor)
      })
      .on('mouseleave', '[data-cursor]', function () {
        self.removeState(this.dataset.cursor)
      })
      .on('mouseenter', '[data-cursor-stick]', function (event) {
        self.setStick(event.target)
      })
      .on('mouseleave', '[data-cursor-stick]', function () {
        self.removeStick()
      })
  }

  mouseMove(e) {
    this.pos = {
      x: this.stick ? this.stick.x - (this.stick.x - e.clientX) * 0.15 : e.clientX,
      y: this.stick ? this.stick.y - (this.stick.y - e.clientY) * 0.15 : e.clientY
    }
    window.cursorPos = this.pos
    this.update()
  }

  computeResize() {
    if (window.innerWidth < 500) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

  frameLoop() {
    if (!this.isMobile) {
      this.vel.x = this.oldPos.x - this.pos.x
      this.vel.y = this.oldPos.y - this.pos.y

      let scaleX = Math.max(1 + -Math.abs(this.vel.y) / 50, 0.15)
      let scaleY = Math.max(1 + -Math.abs(this.vel.x) / 50, 0.15)

      this.move(this.pos.x, this.pos.y, scaleX, scaleY, 1, 0)

      requestAnimationFrame(this.frameLoop.bind(this))
    }
  }

  move(x, y, scaleX, scaleY, duration, rotation) {
    let scale = {
      x: 1,
      y: 1
    }

    if (this.hasToScale) {
      scale = {
        x: scaleX,
        y: scaleY
      }
    }

    gsap.to(this.el, {
      x: x,
      y: y,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      // rotation: rotation / 10,
      scaleX: scale.x,
      scaleY: scale.y,
      // duration: this.visible ? this.options.speed : 0,
      duration: this.visible ? duration || this.options.speed : 0
    })
    this.oldPos = { x: x, y: y }
  }

  setState(state) {
    this.el.addClass(state)
  }

  removeState(state) {
    this.el.removeClass(state)
  }

  toggleState(state) {
    this.el.toggleClass(state)
  }

  setText(text) {
    // this.text.html(text);
    this.el.addClass('-text')
  }

  removeText() {
    this.el.removeClass('-text')
  }

  setStick(el) {
    const target = $(el)
    const bound = el.getBoundingClientRect()
    $(this.el).addClass('-sticky')
    this.stick = {
      y: bound.top + target.outerHeight() / 2,
      x: bound.left + target.outerWidth() / 2
    }
  }

  removeStick() {
    $(this.el).removeClass('-sticky')
    this.stick = false
  }

  update() {
    this.show()
  }

  show() {
    if (this.visible) return
    clearInterval(this.visibleInt)
    this.el.addClass('-visible')
    this.visibleInt = setTimeout(() => (this.visible = true))
  }

  hide() {
    clearInterval(this.visibleInt)
    this.el.removeClass('-visible')
    this.visibleInt = setTimeout(() => (this.visible = false), this.options.visibleTimeout)
  }
}

;(function () {
  const cursor = new Cursor()
})()
