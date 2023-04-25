import { ShaderMaterial, Texture } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export function createTextureOverlapPass(texture: Texture) {
  const pass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        overlapTexture: { value: texture },
      },

      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,

      fragmentShader: /* glsl */ `
        uniform sampler2D baseTexture;
        uniform sampler2D overlapTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( overlapTexture, vUv ) );
        }`,

      defines: {},
    }),
    'baseTexture',
  )
  pass.needsSwap = true

  return pass
}
