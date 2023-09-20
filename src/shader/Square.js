import { Uniform } from 'three'
import { BlendFunction, Effect } from 'postprocessing'
import { wrapEffect } from './utils.tsx'

const rectDataArray = new Float32Array(10 * 4)
const rectOffsetArray = new Float32Array(10 * 2)
for (let i = 0; i < 40; i++) {
  const isWide = Math.random() > 0.2
  rectDataArray[i * 4] = Math.random()
  rectDataArray[i * 4 + 1] = Math.random()

  if (isWide) {
    rectDataArray[i * 4 + 2] = Math.random() * 0.8 + 0.1 // Wide width
    rectDataArray[i * 4 + 3] = Math.random() * 0.05 + 0.02 // Very thin height
  } else {
    rectDataArray[i * 4 + 2] = Math.random() * 0.05 + 0.02 // Very thin width
    rectDataArray[i * 4 + 3] = Math.random() * 0.8 + 0.1 // Tall height
  }

  rectOffsetArray[i * 2] = Math.random() * 0.5 - 0.25
  rectOffsetArray[i * 2 + 1] = Math.random() * 0.5 - 0.25
}

console.log(rectOffsetArray)

const SquareShader = {
  uniforms: {
    u_force: { value: 1 },
    u_rectData: { value: rectDataArray },
    u_rectOffset: { value: rectOffsetArray } // New uniform for offsets
  },

  vertexShader: `
  `,

  fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform sampler2D u_rectangle_texture;
      uniform float u_rectData[40];
      uniform float u_rectOffset[20]; // New uniform

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 original_color = texture2D(u_rectangle_texture, uv);
        outputColor = original_color;
    
        for(int i = 0; i < 10; i++) {
            vec2 rectangleCenter = vec2(u_rectData[i * 4], u_rectData[i * 4 + 1]); 
            vec2 rectangleSize = vec2(u_rectData[i * 4 + 2], u_rectData[i * 4 + 3]);
            vec2 rectangleMin = rectangleCenter - rectangleSize * 0.5;
            vec2 rectangleMax = rectangleCenter + rectangleSize * 0.5;
    
            if(uv.x > rectangleMin.x && uv.x < rectangleMax.x && uv.y > rectangleMin.y && uv.y < rectangleMax.y) {
                vec2 offset = vec2(u_rectOffset[i * 2], u_rectOffset[i * 2 + 1]);
                if (rectangleSize.x > 0.6) { // It's a wide rectangle
                    outputColor = texture2D(u_rectangle_texture, vec2(uv.x + offset.x, rectangleCenter.y + offset.y));
                } else if (rectangleSize.y > 0.6) { // It's a tall rectangle
                    outputColor = texture2D(u_rectangle_texture, vec2(rectangleCenter.x + offset.x, uv.y + offset.y));
                } else {
                    outputColor = texture2D(u_rectangle_texture, uv + offset);
                }
            }
        }
    }
    
    `
}

export class SquareEffect extends Effect {
  constructor(u_force = 1, u_rectData = rectDataArray, u_rectOffset = rectOffsetArray) {
    console.log('toto', u_rectData)
    super('SquareEffect', SquareShader.fragmentShader, {
      blendFunction: BlendFunction.MULTIPLY,
      vertexShader: SquareShader.vertexShader,
      uniforms: new Map([
        ['u_force', new Uniform(u_force)],
        ['u_rectData', new Uniform(rectDataArray)],
        ['u_rectOffset', new Uniform(rectOffsetArray)]
      ])
    })
  }
}

export const Square = wrapEffect(SquareEffect)
