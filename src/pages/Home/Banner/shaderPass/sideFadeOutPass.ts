import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export function createSideFadeOutPass() {
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
    },

    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float x;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        x = (gl_Position.x + 1.0) * 0.5;
      }`,

    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      varying float x;
      void main() {
        gl_FragColor = texture2D( tDiffuse, vUv );
        float edgeDist = (0.5 - abs(x - 0.5));
        gl_FragColor.a = edgeDist * 2.0;
      }`,
  })

  pass.material.transparent = true

  return pass
}
