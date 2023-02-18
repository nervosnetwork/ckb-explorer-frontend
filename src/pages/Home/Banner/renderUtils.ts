import { Mesh, Frustum, Vector3, Layers, Object3D, Vector2, Scene, WebGLRenderer } from 'three'
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export type CubeMap = Partial<{
  [x: number]: Partial<{
    [z: number]: Mesh
  }>
}>

// `frustum.containsPoint` of the variation
export function containsPoint(frustum: Frustum, point: Vector3, tolerance = 0) {
  const { planes } = frustum

  for (let i = 0; i < 6; i++) {
    if (planes[i].distanceToPoint(point) < -tolerance) {
      return false
    }
  }

  return true
}

// Reference from:
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
export function createBloomComposerController(
  renderer: WebGLRenderer,
  scene: Scene,
  width: number,
  height: number,
  beforePasses: Pass[],
): {
  composer: EffectComposer
  toggleBloom: (mesh: Mesh) => void
  render: (delta?: number) => void
  dispose: () => void
} {
  const BLOOM_SCENE = 1
  const bloomLayer = new Layers()
  bloomLayer.set(BLOOM_SCENE)

  function setNoRenderIfNonBloomed() {
    const objs: Object3D[] = []
    scene.traverse((obj: Object3D | Mesh) => {
      if ('isMesh' in obj && obj.isMesh && bloomLayer.test(obj.layers) === false) {
        objs.push(obj)
      }
    })

    objs.forEach(obj => scene.remove(obj))
    return () => objs.forEach(obj => scene.add(obj))
  }

  const bloomPass = new UnrealBloomPass(new Vector2(width, height), 1.5, 0.5, 0)

  const composer = new EffectComposer(renderer)
  composer.renderToScreen = false
  beforePasses.forEach(p => composer.addPass(p))
  composer.addPass(bloomPass)

  return {
    composer,
    toggleBloom(mesh) {
      mesh.layers.toggle(BLOOM_SCENE)
    },
    render(delta) {
      const restore = setNoRenderIfNonBloomed()
      composer.render(delta)
      restore()
    },
    dispose() {
      composer.dispose()
      bloomPass.dispose()
    },
  }
}
