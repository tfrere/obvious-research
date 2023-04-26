import * as THREE from 'three'
import { extend } from '@react-three/fiber'

export default class OutlineMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        offset: { value: 5.1 }
      },
      vertexShader: `
      uniform float offset;
      void main() {
          vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );
          gl_Position = projectionMatrix * pos;
      }`,
      fragmentShader: `
      void main(){
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
      }`
    })
  }
}

extend({ OutlineMaterial })
