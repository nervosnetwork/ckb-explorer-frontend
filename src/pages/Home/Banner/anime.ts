import { Mesh } from 'three'
import { gsap } from 'gsap'
import { singleton } from '../../../utils/util'
import { assert } from '../../../utils/error'

export const playNewBlockAnime = singleton(_playNewBlockAnime)

// eslint-disable-next-line no-underscore-dangle
function _playNewBlockAnime(cubes: Mesh[], textCubes: Mesh[], dataCubes: Mesh[], createFloatCube: () => Mesh) {
  return Promise.all(cubes.map(startCubeAnime))

  async function startCubeAnime(cube: Mesh): Promise<gsap.core.Animation> {
    const textCubeFirstUpDistance = 40
    const ySpeedPerSecond = 60
    const getMoveTime = (distance: number) => distance / ySpeedPerSecond

    if (textCubes.includes(cube)) {
      return gsap
        .timeline()
        .to(cube.position, {
          y: cube.position.y + textCubeFirstUpDistance,
          duration: getMoveTime(textCubeFirstUpDistance),
        })
        .to(cube.position, { delay: 1.1, y: cube.position.y, duration: getMoveTime(textCubeFirstUpDistance) })
    }

    const distance = Math.sqrt(cube.position.x ** 2 + cube.position.z ** 2)
    const maxDistanceWithReduction = 1000
    const reductionRatio = distance > maxDistanceWithReduction ? 0 : 1 - distance / maxDistanceWithReduction
    const textCubeFirstUpDuration = getMoveTime(textCubeFirstUpDistance) * 1e3

    const timeline = gsap
      .timeline()
      .to(cube.position, {
        delay: (distance + textCubeFirstUpDuration - 500 * reductionRatio) / 1e3,
        y: cube.position.y + 40,
        duration: getMoveTime(40),
      })
      .to(cube.position, {
        delay: getMoveTime(60),
        y: cube.position.y,
        duration: getMoveTime(40),
      })

    if (!dataCubes.includes(cube)) return timeline

    const isFloatCubeCreator = cube === dataCubes[1]

    const createFloatCubeTimeline = () => {
      const floatCubeDuration = getMoveTime(1500) / 5
      const floatCube = createFloatCube()
      assert(!Array.isArray(floatCube.material))
      floatCube.material.opacity = 0
      floatCube.position.copy(cube.position)

      return gsap
        .timeline()
        .addLabel('start')
        .to(
          floatCube.material,
          {
            // Set a large value to offset transmission.
            opacity: 10,
            duration: 1,
          },
          'start',
        )
        .to(
          floatCube.position,
          {
            y: 1500,
            duration: floatCubeDuration,
            onComplete() {
              floatCube.removeFromParent()
              floatCube.geometry.dispose()
              assert(!Array.isArray(floatCube.material))
              floatCube.material.dispose()
            },
          },
          'start',
        )
        .to(
          floatCube.rotation,
          {
            x: 2.42 / 8,
            y: 3.21 / 8,
            z: 14 / 8,
            duration: floatCubeDuration,
          },
          'start',
        )
    }

    timeline
      .to(cube.scale, {
        y: 1 + (120 * 2) / 100,
        duration: 120 / (ySpeedPerSecond * 2),
      })
      // ">" The end of the previous animation, "<" The start of previous animation
      .addLabel('onDataCubeScaleEnd', '>')
      .addLabel('onDataCubeScaleStart', '<')
      .add(isFloatCubeCreator ? createFloatCubeTimeline() : [], 'onDataCubeScaleStart')
      .to(
        cube.scale,
        {
          delay: 1,
          y: 1,
          duration: 120 / (ySpeedPerSecond * 2),
        },
        'onDataCubeScaleEnd',
      )

    return timeline
  }
}
