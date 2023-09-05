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
    this.text = $(
      '<div class="cursor-text"><div class="cursor-text__title">Visit website.</div><div class="cursor-text__instruction">click and hold<br/> to open</div></div>'
    )
    this.video = $(
      '<div class="cursor-media"><video class="cursor-media__video"  src="/images/obvious.mp4" preload="auto" autoplay="" muted="" loop="" id="obvious" style="display: none;"></video><video  class="cursor-media__video" src="/images/personal.mp4" preload="auto" autoplay="" muted="" loop="" id="personal" style="display: none;"></video><video class="cursor-media__video"  src="/images/ui.mp4" preload="auto" autoplay="" muted="" loop="" id="ui" style="display: none;"></video></div>'
    )
    this.oldTarget = null
    this.pos = { x: 0, y: 0 }
    this.oldPos = { x: 0, y: 0 }
    this.vel = { x: 0, y: 0 }

    this.init()
  }

  init() {
    this.el.append(this.text)
    this.el.append(this.video)
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
      .on('mouseenter', '[data-cursor-text]', function () {
        self.hasToScale = true
        self.setText(this.dataset.cursorText)
      })
      .on('mouseleave', '[data-cursor-text]', function () {
        self.hasToScale = false
        self.removeText()
      })
      .on('mousedown', '[data-cursor-link]', (event) => {
        $(this.elCircle).addClass('-holding')
        // self.setText("hold to open");
        this.linkTimeout = window.setTimeout(() => {
          window.open($(event.target).attr('href'), '_blank')
          this.linkTimeout = window.setTimeout(() => {
            $(this.elCircle).removeClass('-holding')
          }, 100)
        }, 1000)
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
        if (!this.isMobile) {
          event.stopPropagation()
          event.preventDefault()
        }
      })
      .on('mouseenter', 'iframe', () => {
        self.hide()
      })
      .on('mouseleave', 'iframe', () => {
        self.show()
      })
      .on('mouseenter', '[data-media-video]', function (event) {
        self.hasToScale = true
        document.getElementById(event.target.getAttribute('data-media-video')).style.display = 'block'
        this.oldTarget = event.target
        clearTimeout(this.mediaTimeout)
      })
      .on('mouseleave', '[data-media-video]', function (event) {
        self.hasToScale = false
        if (this.oldTarget) {
          document.getElementById(event.target.getAttribute('data-media-video')).style.display = 'none'
          this.oldTarget = null
        } else {
          this.mediaTimeout = window.setTimeout(() => {
            document.getElementById(event.target.getAttribute('data-media-video')).style.display = 'none'
            this.oldTarget = null
          }, 1000)
        }
      })
      .on('mouseenter', '[data-cursor]', function () {
        self.setState(this.dataset.cursor)
      })
      .on('mouseleave', '[data-cursor]', function () {
        self.removeState(this.dataset.cursor)
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
    const bound = target.get(0).getBoundingClientRect()
    this.stick = {
      y: bound.top + target.height() / 2,
      x: bound.left + target.width() / 2
    }
  }

  removeStick() {
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
