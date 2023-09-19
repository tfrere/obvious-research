import { Uniform } from 'three'
import { BlendFunction, Effect } from 'postprocessing'
import { wrapEffect } from './utils.tsx'

const WaveShader = {
  uniforms: {
    u_time: { value: 0 },
    u_mouse: { value: [0.5, 0.5] } // Assuming mouse position is normalized (0.0 - 1.0)
  },

  vertexShader: `
  `,

  fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform sampler2D u_wave_texture;
      uniform vec2 u_mouse;
      uniform float u_time;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 p = uv - u_mouse;
          float dist = length(p);
          vec2 offset = normalize(p) * sin(dist * 10.0 - u_time * 2.0) * 0.05; // Adjust these values to control the wave's frequency and amplitude
          
          outputColor = texture2D(u_wave_texture, uv + offset);
      }
    `
}

export class WaveEffect extends Effect {
  constructor() {
    super('WaveEffect', WaveShader.fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      vertexShader: WaveShader.vertexShader,
      uniforms: new Map([
        ['u_time', new Uniform(0)],
        ['u_mouse', new Uniform([0.5, 0.5])]
      ])
    })
  }
}

export const Wave = wrapEffect(WaveEffect)
