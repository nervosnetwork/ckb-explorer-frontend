import {
  Mesh,
  Frustum,
  Vector3,
  Layers,
  Object3D,
  Vector2,
  Scene,
  WebGLRenderer,
  Quaternion,
  BoxGeometry,
  InstancedMesh,
  Material,
  Matrix4,
} from 'three'
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { pick } from '../../../utils/object'

export type CubeMap = Partial<{
  [x: number]: Partial<{
    [z: number]: Mesh
  }>
}>

export interface CubeOffset {
  x: number
  z: number
}

// eslint-disable-next-line no-redeclare
export namespace CubeOffset {
  export function isEqual(a: CubeOffset, b: CubeOffset) {
    return a.x === b.x && a.z === b.z
  }
}

export interface InstancedCubeUnitControl {
  position: Vector3
  quaternion: Quaternion
  scale: Vector3
  onUpdate: () => void
}

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

export function createInstancedCubeMesh(
  cubes: { x: number; z: number; initPosition: Vector3 }[],
  cubeIndexMap: Record<string, Record<string, number>>,
  geometry: BoxGeometry,
  material: Material,
) {
  const mesh = new InstancedMesh(geometry, material, cubes.length)
  const matrix = new Matrix4()
  cubes.forEach(({ initPosition }, idx) => {
    matrix.setPosition(initPosition)
    mesh.setMatrixAt(idx, matrix)
  })

  return {
    mesh,
    cubeOffsets: cubes.map(cube => pick(cube, ['x', 'z'])),
    getCubeControl(xOrIndex: number, z?: number): InstancedCubeUnitControl | null {
      const idx = z == null ? xOrIndex : cubeIndexMap[xOrIndex]?.[z]
      if (idx == null) return null

      mesh.getMatrixAt(idx, matrix)
      const position = new Vector3()
      const quaternion = new Quaternion()
      const scale = new Vector3()
      matrix.decompose(position, quaternion, scale)

      return {
        position,
        quaternion,
        scale,
        onUpdate() {
          mesh.setMatrixAt(idx, new Matrix4().compose(position, quaternion, scale))
          mesh.instanceMatrix.needsUpdate = true
        },
      }
    },
  }
}
