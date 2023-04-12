import { DirectionalLight, OrthographicCamera, Scene, Vector3, WebGLRenderer, sRGBEncoding } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { createSideFadeOutPass } from './shaderPass/sideFadeOutPass'
import { createBloomComposerController } from './renderUtils'
import { assert } from '../../../utils/error'
import { createTextCubes } from './render'

export function renderTinyTestScene(container: HTMLElement) {
  const startTime = Date.now()
  const scene = new Scene()
  // The following number constants are from the design draft.
  const camera = new OrthographicCamera()
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = sRGBEncoding
  container.appendChild(renderer.domElement)

  // Fixed a viewing angle.
  const cubeSize = new Vector3(100, 200, 100)
  const gap = 10
  const { mesh: textCubes } = createTextCubes(cubeSize, gap)
  scene.add(textCubes)

  const highlight1 = new DirectionalLight(0x999999, 12)
  highlight1.position.set(1, 1, 0)
  scene.add(highlight1)

  const renderPass = new RenderPass(scene, camera)
  const sideFadeOutPass = createSideFadeOutPass()
  const bloomComposerCtl = createBloomComposerController(
    renderer,
    scene,
    container.clientWidth,
    container.clientHeight,
    [renderPass],
  )

  const finalComposer = new EffectComposer(renderer)
  finalComposer.addPass(renderPass)
  finalComposer.addPass(sideFadeOutPass)

  function render() {
    bloomComposerCtl.render()
    finalComposer.render()
  }
  render()

  function destroy() {
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
  destroy()
  return Date.now() - startTime
}
