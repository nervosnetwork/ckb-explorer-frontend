import {
  Camera,
  DirectionalLight,
  Frustum,
  Matrix4,
  Mesh,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { playNewBlockAnime } from './anime'
import { BooleanT } from '../../../utils/array'
import { createSideFadeOutPass } from './shaderPass/sideFadeOutPass'
import { createTextureOverlapPass } from './shaderPass/textureOverlapPass'
import { containsPoint, createBloomComposerController, CubeMap } from './renderUtils'
import { assert } from '../../../utils/error'

export interface BannerRender {
  onNewBlock: (block: State.Block) => void
  onResize: () => void
  destroy: () => void
}

export function createBannerRender(container: HTMLElement) {
  const width = container.clientWidth
  const height = container.clientHeight
  const aspect = width / height
  const scene = new Scene()
  // The following number constants are from the design draft.
  const camera = new OrthographicCamera(-700 * aspect, 700 * aspect, 150 * aspect, -150 * aspect, -100000, 100000)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Fixed a viewing angle.
  camera.rotation.x = Math.PI / (180 / -37.46)
  camera.rotation.y = Math.PI / (180 / -33.83)
  camera.rotation.z = Math.PI / (180 / -28)
  camera.position.x = -540
  camera.position.z = 880
  camera.position.y = 720
  camera.updateWorldMatrix(true, false)

  const cubeMap = createCubes(camera, 100, 10)
  const textCubes = getTextCubes(cubeMap, 'C K B')
  textCubes.forEach(cube => {
    // eslint-disable-next-line no-param-reassign
    cube.material = new MeshNormalMaterial()
    cube.position.add(new Vector3(0, 40, 0))
  })
  const cubes = Object.values(cubeMap)
    .map(cubeMapWithColumn => Object.values(cubeMapWithColumn ?? {}))
    .flat()
    .filter(BooleanT())
  cubes.forEach(cube => scene.add(cube))

  const light = new DirectionalLight(0xfff0dd, 20)
  light.position.set(0, 50, 120)
  scene.add(light)

  const renderPass = new RenderPass(scene, camera)
  const sideFadeOutPass = createSideFadeOutPass()
  const bloomComposerCtl = createBloomComposerController(renderer, scene, width, height, [renderPass])
  const bloomTextureOverlapPass = createTextureOverlapPass(bloomComposerCtl.composer.renderTarget2.texture)

  const finalComposer = new EffectComposer(renderer)
  finalComposer.addPass(renderPass)
  finalComposer.addPass(bloomTextureOverlapPass)
  finalComposer.addPass(sideFadeOutPass)

  let stopRenderLoop: (() => void) | null = null
  function render() {
    const handle = requestAnimationFrame(render)
    stopRenderLoop = () => cancelAnimationFrame(handle)

    bloomComposerCtl.render()
    finalComposer.render()
  }
  render()

  function createFloatCube() {
    const boxGeometry = new RoundedBoxGeometry(100, 100, 100, 6, 6)
    const boxMaterial = new MeshPhysicalMaterial({
      metalness: 0.1,
      roughness: 0.7,

      transmission: 1,
      color: 0x26b562,
      transparent: true,
    })
    const cube = new Mesh(boxGeometry, boxMaterial)
    bloomComposerCtl.toggleBloom(cube)
    scene.add(cube)
    return cube
  }

  return {
    onNewBlock(block: State.Block) {
      playNewBlockAnime(
        cubes,
        textCubes,
        getDataCubes(camera, cubeMap, textCubes, block.transactionsCount),
        createFloatCube,
      )
    },
    onResize() {
      renderer.setSize(container.clientWidth, container.clientHeight)
    },
    destroy() {
      stopRenderLoop?.()

      // It is expected that the rest of the resources will be automatically reclaimed by GC.
      finalComposer.dispose()
      renderer.dispose()

      renderPass.dispose()
      sideFadeOutPass.dispose()
      bloomComposerCtl.dispose()
      bloomTextureOverlapPass.dispose()

      light.dispose()
      cubes.forEach(cube => {
        cube.removeFromParent()
        cube.geometry.dispose()
        assert(!Array.isArray(cube.material))
        cube.material.dispose()
      })

      renderer.domElement.remove()
    },
  }
}

function createCubes(camera: Camera, size: number, gap: number, centerPos: Vector3 = new Vector3(0, 0, 0)) {
  const boxGeometry = new RoundedBoxGeometry(size, size * 2, size, 6, 6)
  const boxMaterial = new MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0.6,

    transmission: 1,
  })
  const cube = new Mesh(boxGeometry, boxMaterial)
  const cubeWidth = size
  const cubeLong = size

  const frustum = new Frustum()
  frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
  const isVisibleToCamera = (pos: Vector3) => containsPoint(frustum, pos, 100)

  const cubeMap: CubeMap = {}
  for (let x = -25; x < 25; x++) {
    for (let z = -30; z < 25; z++) {
      const cloned = cube.clone()
      const xOffset = x * (cubeWidth + gap)
      const zOffset = z * (cubeLong + gap)
      cloned.position.set(
        centerPos.x + (xOffset + gap / 2 + cubeWidth),
        centerPos.y + cube.position.y,
        centerPos.z + (zOffset + gap / 2 + cubeLong),
      )
      if (isVisibleToCamera(cloned.position)) {
        const cubeMapWithColumn = cubeMap[x] ?? (cubeMap[x] = {})
        cubeMapWithColumn[z] = cloned
      }
    }
  }

  return cubeMap
}

function getDataCubes(camera: OrthographicCamera, cubeMap: CubeMap, textCubes: Mesh[], count: number) {
  const smallVisionCamera = camera.clone()
  smallVisionCamera.left *= 0.7
  smallVisionCamera.right *= 0.7
  smallVisionCamera.updateProjectionMatrix()
  const frustum = new Frustum()
  frustum.setFromProjectionMatrix(
    new Matrix4().multiplyMatrices(smallVisionCamera.projectionMatrix, smallVisionCamera.matrixWorldInverse),
  )
  const isNearToViewport = (pos: Vector3) => containsPoint(frustum, pos, -100)

  const textRect = { x1: 0, z1: 0, x2: 0, z2: 0 }
  textCubes.forEach(cube => {
    textRect.x1 = Math.min(textRect.x1, cube.position.x)
    textRect.z1 = Math.min(textRect.z1, cube.position.z)
    textRect.x2 = Math.max(textRect.x2, cube.position.x)
    textRect.z2 = Math.max(textRect.z2, cube.position.z)
  })
  const isInTextRect = (cube: Mesh) =>
    cube.position.x >= textRect.x1 &&
    cube.position.x <= textRect.x2 &&
    cube.position.z >= textRect.z1 &&
    cube.position.z <= textRect.z2

  const cubes: Mesh[] = []
  while (count > cubes.length) {
    const cube = cubeMap[random(-25, 25)]?.[random(-30, 25)]
    if (cube == null || cubes.includes(cube) || isInTextRect(cube) || !isNearToViewport(cube.position)) continue
    cubes.push(cube)
  }
  return cubes
}

function random(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function getTextCubes(cubeMap: CubeMap, text: string, font = '100 8px Arial') {
  if (text !== 'C K B' || font !== '100 8px Arial') {
    throw new Error(
      'This function is not fully implemented, you need to refactor this function to pass in parameters freely',
    )
  }

  return [
    // C
    [-7, -1],
    [-7, 0],
    [-6, -2],
    [-6, 1],
    [-5, -3],
    [-5, 2],
    [-4, -3],
    [-4, 2],
    // K
    [-1, -3],
    [-1, -2],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, -1],
    [0, 0],
    [1, -2],
    [1, 1],
    [2, -3],
    [2, 2],
    // B
    [5, -3],
    [5, -2],
    [5, -1],
    [5, 0],
    [5, 1],
    [5, 2],
    [6, -3],
    [6, 0],
    [6, 2],
    [7, -2],
    [7, -1],
    [7, 1],
  ]
    .map(([x, y]) => cubeMap[x]?.[y])
    .filter(BooleanT())
}
