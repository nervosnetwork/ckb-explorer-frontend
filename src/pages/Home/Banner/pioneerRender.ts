import { DirectionalLight, OrthographicCamera, Scene, Vector3, WebGLRenderer, sRGBEncoding } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { createSideFadeOutPass } from './shaderPass/sideFadeOutPass'
import { createBloomComposerController } from './renderUtils'
import { assert } from '../../../utils/error'
import { BannerRender, createTextCubes } from './render'

export function createPioneerRender(container: HTMLElement, setRender: (r?: BannerRender) => void, next: () => any) {
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
  const { mesh: textCubes } = createTextCubes(cubeSize, gap)
  scene.add(textCubes)

  const highlight1 = new DirectionalLight(0x999999, 12)
  highlight1.position.set(1, 1, 0)
  scene.add(highlight1)

  const renderPass = new RenderPass(scene, camera)
  const sideFadeOutPass = createSideFadeOutPass()
  const bloomComposerCtl = createBloomComposerController(renderer, scene, width, height, [renderPass])

  const finalComposer = new EffectComposer(renderer)
  finalComposer.addPass(renderPass)
  finalComposer.addPass(sideFadeOutPass)

  let stopRenderLoop: (() => void) | null = null
  let frame = 0
  function render() {
    frame++

    const handle = requestAnimationFrame(render)
    stopRenderLoop = () => cancelAnimationFrame(handle)

    bloomComposerCtl.render()
    finalComposer.render()
  }
  render()

  function destroy() {
    stopRenderLoop?.()

    // It is expected that the rest of the resources will be automatically reclaimed by GC.
    finalComposer.dispose()
    renderer.dispose()

    renderPass.dispose()
    sideFadeOutPass.dispose()
    bloomComposerCtl.dispose()

    highlight1.dispose()

    const meshes = [textCubes]
    meshes.forEach(mesh => {
      mesh.removeFromParent()
      mesh.geometry.dispose()
      assert(!Array.isArray(mesh.material))
      mesh.material.dispose()
    })

    renderer.domElement.remove()
  }

  setTimeout(() => {
    if (frame > 10) {
      setRender(next())
    } else {
      setRender(undefined)
    }
    destroy()
  }, 200)
  setRender({
    onNewBlock: () => {},
    destroy,
    onResize: () => {},
  })
}
