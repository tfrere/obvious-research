import { Uniform } from 'three'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { wrapEffect } from './utils.tsx'
import { EffectComposer } from '@react-three/postprocessing'
import { useControls, useCreateStore } from 'leva'
import { useEffect } from 'react'

const LineShader = {
  uniforms: {
    u_force: { value: 1 }
  },

  vertexShader: `
    `,

  fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform sampler2D u_line_texture;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 sym_texCoord = vec2(1.0 - uv.x, uv.y);
          vec4 original_color = texture2D(u_line_texture, uv);
          vec4 sym_color = texture2D(u_line_texture, sym_texCoord);

          // half amount = 1; // pixels
          // half threshold = fwidth(i.uv.y) * amount;

        outputColor = inputColor;

        if(uv.x > 0.025 && uv.x < 0.975 && uv.y < 0.05 && uv.y > 0.040) {
            outputColor = texture2D(u_line_texture, vec2(uv.x, 0.3)) * 2.0;
        }  

        if(uv.x > 0.025 && uv.x < 0.975 && uv.y < 0.95 && uv.y > 0.940) {
            outputColor = texture2D(u_line_texture, vec2(uv.x, 0.6)) * 2.0;
        }  
      }
    `
}

export class LineEffect extends Effect {
  constructor(u_force = 1) {
    super('LineEffect', LineShader.fragmentShader, {
      blendFunction: BlendFunction.MULTIPLY,
      vertexShader: LineShader.vertexShader,
      uniforms: new Map([['u_force', new Uniform(u_force)]])
    })
  }
}

export const Line = wrapEffect(LineEffect)
