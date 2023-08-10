import { Uniform } from 'three'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { wrapEffect } from './utils.tsx'
import { EffectComposer } from '@react-three/postprocessing'
import { useControls, useCreateStore } from 'leva'
import { useEffect } from 'react'

const SymmetryShader = {
  fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif
  
      uniform sampler2D u_sim_texture;
      uniform int u_force;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 original_color = texture2D(u_sim_texture, uv);
        vec2 p = 0.5 - (0.5 - uv) / 1.5;

        if(u_force == 0) {
            outputColor = inputColor;
        }
        else if(u_force == 1) {
            if (uv.x > 0.5) {
                // outputColor = texture2D(u_sim_texture, p);
                outputColor = original_color;
            } else { 
                vec2 sym_texCoord = vec2(1. - uv.x, uv.y);
                vec4 sym_color = texture2D(u_sim_texture, sym_texCoord);
                outputColor = sym_color;
            }
        }
        else if(u_force == 2) {
            if (uv.x <= 0.5 && uv.y <= 0.5) {
                outputColor = original_color;
            } 
            else if (uv.x >= 0.5 && uv.y <= 0.5) {
                vec2 sym_texCoord = vec2(1.0 - uv.x, uv.y);
                vec4 sym_color = texture2D(u_sim_texture, sym_texCoord);
                outputColor = sym_color;
            } 
            else if (uv.x <= 0.5 && uv.y >= 0.5) {
                vec2 sym_texCoord = vec2(uv.x, 1.0 - uv.y);
                vec4 sym_color = texture2D(u_sim_texture, sym_texCoord);
                outputColor = sym_color;
            } 
            else if (uv.x >= 0.5 && uv.y >= 0.5) {
                vec2 sym_texCoord = vec2(1.0 - uv.x, 1.0 - uv.y);
                vec4 sym_color = texture2D(u_sim_texture, sym_texCoord);
                outputColor = sym_color;
            } 
        }

      }
    `
}

export class SymmetryEffect extends Effect {
  constructor(param) {
    super('SymmetryEffect', SymmetryShader.fragmentShader, {
      uniforms: new Map([['u_force', new Uniform(param.u_force)]])
    })
  }
}

export const Symmetry = wrapEffect(SymmetryEffect)
