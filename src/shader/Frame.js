import { Uniform } from 'three'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { wrapEffect } from './utils.tsx'

const FrameShader = {
  uniforms: {
    u_symmetryPoints: { value: 6 }
  },

  vertexShader: `
      `,

  fragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
    
        uniform sampler2D u_textures;

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
            vec2 sym_texCoord = vec2(uv.x, 1.0 - uv.y);
            vec4 original_color = texture2D(u_textures, uv);
            vec4 sym_color = texture2D(u_textures, sym_texCoord);
  
            // half amount = 1; // pixels
            // half threshold = fwidth(i.uv.y) * amount;

          outputColor = inputColor;

          if(uv.y < 0.05) {
              outputColor = sym_color;
          }  
          if(uv.x < 0.025) {
            outputColor = sym_color;
          }  
          if(uv.y > 0.95) {
              outputColor = sym_color;
          }
          if(uv.x > 0.975) {
            outputColor = sym_color;
        }            
        }
      `
}

export class FrameEffect extends Effect {
  constructor() {
    super('FrameEffect', FrameShader.fragmentShader, {
      blendFunction: BlendFunction.MULTIPLY,
      vertexShader: FrameShader.vertexShader,
      uniforms: new Map([['u_symmetryPoints', new Uniform(6)]])
    })
  }
}

export const Frame = wrapEffect(FrameEffect)
