import {
  Camera,
  DirectionalLight,
  Frustum,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
  MeshLambertMaterial,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { playNewBlockAnime } from './anime'
import { isMainnet } from '../../../utils/chain'
import { createSideFadeOutPass } from './shaderPass/sideFadeOutPass'
import { createTextureOverlapPass } from './shaderPass/textureOverlapPass'
import {
  containsPoint,
  createBloomComposerController,
  createInstancedCubeMesh,
  CubeOffset,
  InstancedCubeUnitControl,
} from './renderUtils'
import { assert } from '../../../utils/error'
import { randomInt } from '../../../utils/util'
import { getPrimaryColor } from '../../../constants/common'

const COLORS = {
  primary: getPrimaryColor(),
  float: isMainnet() ? 0x00330b : 0x4d1676,
}

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
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = sRGBEncoding
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

  const cubeSize = new Vector3(100, 200, 100)
  const gap = 10
  const {
    mesh: textCubes,
    cubeOffsets: textCubeOffsets,
    getCubeControl: getTextCubeControl,
  } = createTextCubes(cubeSize, gap)
  const {
    mesh: normalCubes,
    cubeOffsets: normalCubeOffsets,
    getCubeControl: getNormalCubeControl,
  } = createNormalCubes(cubeSize, gap, camera, textCubeOffsets)
  scene.add(normalCubes)
  scene.add(textCubes)

  const highlight1 = new DirectionalLight(0x999999, 12)
  highlight1.position.set(1, 1, 0)
  scene.add(highlight1)

  const highlight2 = new DirectionalLight(COLORS.primary, 600)
  highlight2.position.set(1, -80, 1)
  scene.add(highlight2)

  const highlight3 = new DirectionalLight(0xffffff, 20)
  highlight3.position.set(-1, -5, 0)
  scene.add(highlight3)

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
    const boxMaterial = new MeshLambertMaterial({
      color: COLORS.float,
      emissive: COLORS.float,
      emissiveIntensity: 0.001,
      transparent: true,
      opacity: 0.8,
    })
    const cube = new Mesh(boxGeometry, boxMaterial)
    bloomComposerCtl.toggleBloom(cube)
    scene.add(cube)
    return cube
  }

  return {
    onNewBlock(block: State.Block) {
      const dataCubeOffsets = getDataCubeOffsets(camera, getNormalCubeControl, textCubeOffsets, block.transactionsCount)
      const combinedGetCubeControl = (x: number, z: number) => {
        const control = getNormalCubeControl(x, z) ?? getTextCubeControl(x, z)
        if (control == null) return null

        const isTextCube = textCubeOffsets.some(offset => CubeOffset.isEqual(offset, { x, z }))
        const isDataCube = dataCubeOffsets.some(offset => CubeOffset.isEqual(offset, { x, z }))
        const isFloatCubeCreator = isDataCube && CubeOffset.isEqual(dataCubeOffsets[0], { x, z })
        return { ...control, isTextCube, isDataCube, isFloatCubeCreator }
      }

      playNewBlockAnime([...normalCubeOffsets, ...textCubeOffsets], combinedGetCubeControl, createFloatCube)
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

      highlight1.dispose()
      highlight2.dispose()
      highlight3.dispose()

      const meshes = [normalCubes, textCubes]
      meshes.forEach(mesh => {
        mesh.removeFromParent()
        mesh.geometry.dispose()
        assert(!Array.isArray(mesh.material))
        mesh.material.dispose()
      })

      renderer.domElement.remove()
    },
  }
}

function createNormalCubes(
  cubeSize: Vector3,
  spacingBetweenCubes: number,
  camera: Camera,
  disabledOffsets: CubeOffset[],
  centerPos: Vector3 = new Vector3(0, 0, 0),
) {
  const cubeCanvasRangeLimit = { minX: -25, maxX: 25, minZ: -30, maxZ: 25 }
  const cubeWidth = cubeSize.x
  const cubeHeight = cubeSize.y
  const cubeLong = cubeSize.z

  const frustum = new Frustum()
  frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
  const isVisibleToCamera = (pos: Vector3) => containsPoint(frustum, pos, Math.max(cubeWidth, cubeLong))

  const cubes: { x: number; z: number; initPosition: Vector3 }[] = []
  const cubeIndexMap: Record<string, Record<string, number>> = {}
  for (let x = cubeCanvasRangeLimit.minX; x < cubeCanvasRangeLimit.maxX; x++) {
    for (let z = cubeCanvasRangeLimit.minZ; z < cubeCanvasRangeLimit.maxZ; z++) {
      const xOffset = x * (cubeWidth + spacingBetweenCubes)
      const zOffset = z * (cubeLong + spacingBetweenCubes)
      const position = new Vector3(
        centerPos.x + (xOffset + spacingBetweenCubes / 2 + cubeWidth),
        centerPos.y + 0,
        centerPos.z + (zOffset + spacingBetweenCubes / 2 + cubeLong),
      )
      const disabled = disabledOffsets.some(offset => CubeOffset.isEqual(offset, { x, z }))
      if (!disabled && isVisibleToCamera(position)) {
        const index = cubes.push({ x, z, initPosition: position }) - 1
        const mapWithColumn = cubeIndexMap[x] ?? (cubeIndexMap[x] = {})
        mapWithColumn[z] = index
      }
    }
  }

  const boxGeometry = new RoundedBoxGeometry(cubeWidth, cubeHeight, cubeLong, 5, 8)
  const boxMaterial = new MeshPhysicalMaterial({
    metalness: 0.01,
    roughness: 0.9,
    clearcoatRoughness: 1,
    transmission: 1,
  })

  return createInstancedCubeMesh(cubes, cubeIndexMap, boxGeometry, boxMaterial)
}

export function createTextCubes(
  cubeSize: Vector3,
  spacingBetweenCubes: number,
  centerPos: Vector3 = new Vector3(0, 0, 0),
) {
  const cubeWidth = cubeSize.x
  const cubeHeight = cubeSize.y
  const cubeLong = cubeSize.z

  const textCubePoints = getTextPoints('C K B')
  const cubes: { x: number; z: number; initPosition: Vector3 }[] = []
  const cubeIndexMap: Record<string, Record<string, number>> = {}
  textCubePoints.forEach(({ x, z }) => {
    const xOffset = x * (cubeWidth + spacingBetweenCubes)
    const zOffset = z * (cubeLong + spacingBetweenCubes)
    const position = new Vector3(
      centerPos.x + (xOffset + spacingBetweenCubes / 2 + cubeWidth),
      centerPos.y + 40,
      centerPos.z + (zOffset + spacingBetweenCubes / 2 + cubeLong),
    )
    const index = cubes.push({ x, z, initPosition: position }) - 1
    const mapWithColumn = cubeIndexMap[x] ?? (cubeIndexMap[x] = {})
    mapWithColumn[z] = index
  })

  const boxGeometry = new RoundedBoxGeometry(cubeWidth, cubeHeight, cubeLong, 5, 8)
  const boxMaterial = new MeshPhysicalMaterial({
    clearcoatRoughness: 1,
    metalness: 0.08,
    roughness: 0.95,
    transmission: 1,
    color: 0xcccccc,
  })

  return createInstancedCubeMesh(cubes, cubeIndexMap, boxGeometry, boxMaterial)
}

function getDataCubeOffsets(
  camera: OrthographicCamera,
  getCubeControl: (x: number, z: number) => InstancedCubeUnitControl | null,
  textCubeOffsets: CubeOffset[],
  count: number,
) {
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
  textCubeOffsets.forEach(({ x, z }) => {
    textRect.x1 = Math.min(textRect.x1, x)
    textRect.z1 = Math.min(textRect.z1, z)
    textRect.x2 = Math.max(textRect.x2, x)
    textRect.z2 = Math.max(textRect.z2, z)
  })
  const isInTextRect = ({ x, z }: CubeOffset) =>
    x >= textRect.x1 && x <= textRect.x2 && z >= textRect.z1 && z <= textRect.z2

  const offsets: CubeOffset[] = []
  while (count > offsets.length) {
    const offset: CubeOffset = { x: randomInt(-25, 25), z: randomInt(-30, 25) }
    const info = getCubeControl(offset.x, offset.z)
    if (
      info == null ||
      offsets.some(existed => CubeOffset.isEqual(existed, offset)) ||
      isInTextRect(offset) ||
      !isNearToViewport(info.position)
    )
      continue
    offsets.push(offset)
  }

  return offsets
}

function getTextPoints(text: string, font = '100 8px Arial') {
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
    [6, -1],
    [6, 2],
    [7, -2],
    [7, 0],
    [7, 1],
  ].map(([x, z]) => ({ x, z }))
}
