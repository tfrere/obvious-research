import { Uniform } from 'three'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { wrapEffect } from './utils.tsx'

const KaleidoscopeShader = {
  uniforms: {
    u_symmetryPoints: { value: 6 }
  },

  vertexShader: `

  `,

  fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform int u_symmetryPoints;
    uniform sampler2D u_texture;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      float angle =( 2.0 * 3.14159265 / float(u_symmetryPoints) );
      vec2 center = vec2(0.5, 0.5);
      vec2 p = uv - center;
      float a = angle * floor((atan(p.y, p.x) + 3.14159265) / angle);
      mat2 rotation = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 st = center + rotation * p;
      outputColor = texture2D(u_texture, st);
    }
  `
}

export class KaleidoscopeEffect extends Effect {
  constructor({ u_symmetryPoints }) {
    super('KaleidoscopeEffect', KaleidoscopeShader.fragmentShader, {
      blendFunction: BlendFunction.MULTIPLY,
      vertexShader: KaleidoscopeShader.vertexShader,
      uniforms: new Map([['u_symmetryPoints', new Uniform(u_symmetryPoints)]])
    })
  }
}

export const Kaleidoscope = wrapEffect(KaleidoscopeEffect)
