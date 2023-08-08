import { Uniform } from 'three'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { wrapEffect } from './utils.tsx'
import { EffectComposer } from '@react-three/postprocessing'
import { useControls, useCreateStore } from 'leva'
import { useEffect } from 'react'

const GlitchesShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv;
      vec2 m = vec2(0.5,0.5);
      float radius = 1.0;
      float dist = radius * distance(p, m);
      p = m + normalize(p - m) * pow(dist, 1.0 - amount);
      gl_FragColor = texture2D(tDiffuse, p);
    }
    `
}

export class GlitchesEffect extends Effect {
  constructor(amount = 1.0) {
    super('GlitchesEffect', GlitchesShader.fragmentShader, {
      blendFunction: BlendFunction.MULTIPLY,
      vertexShader: GlitchesShader.vertexShader,
      uniforms: new Map([['amount', new Uniform(amount)]])
    })
  }
}

export const Glitches = wrapEffect(GlitchesEffect)
