import { Mesh } from 'three'
import { gsap } from 'gsap'
import { singleton } from '../../../utils/util'
import { assert } from '../../../utils/error'

export const playNewBlockAnime = singleton(_playNewBlockAnime)

const DURATION_TO_PROTRUDE = 5 // duration to protrude
const DELAY_OF_RIPPLE = 10 // change the distance between edges of a ripple

// eslint-disable-next-line no-underscore-dangle
function _playNewBlockAnime(cubes: Mesh[], textCubes: Mesh[], dataCubes: Mesh[], createFloatCube: () => Mesh) {
  return Promise.all(cubes.map(startCubeAnime))

  async function startCubeAnime(cube: Mesh): Promise<gsap.core.Animation> {
    const textCubeFirstUpDistance = 40
    const ySpeedPerSecond = 150
    const getMoveTime = (distance: number) => distance / ySpeedPerSecond

    if (textCubes.includes(cube)) {
      return gsap
        .timeline()
        .to(cube.position, {
          y: cube.position.y + textCubeFirstUpDistance * 2,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 5),
        })
        .to(cube.position, {
          delay: 0.1,
          y: cube.position.y - textCubeFirstUpDistance / 2,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 3),
        })
        .to(cube.position, {
          delay: 0.05,
          y: cube.position.y + textCubeFirstUpDistance / 3,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 2),
        })
        .to(cube.position, { delay: 0.01, y: cube.position.y, duration: getMoveTime(DURATION_TO_PROTRUDE * 2) })
    }

    const distance = Math.sqrt(cube.position.x ** 2 + cube.position.z ** 2)
    const maxDistanceWithReduction = 1000
    const reductionRatio = distance > maxDistanceWithReduction ? 0 : 1 - distance / maxDistanceWithReduction
    const textCubeFirstUpDuration = getMoveTime(textCubeFirstUpDistance) * 4e3

    const timeline = gsap
      .timeline()
      .to(cube.position, {
        delay: (distance + textCubeFirstUpDuration - 500 * reductionRatio) / 2500,
        y: cube.position.y + 40,
        duration: getMoveTime(DURATION_TO_PROTRUDE),
      })
      .to(cube.position, {
        delay: getMoveTime(DELAY_OF_RIPPLE),
        y: cube.position.y,
        duration: getMoveTime(DURATION_TO_PROTRUDE),
      })

    if (!dataCubes.includes(cube)) return timeline

    const isFloatCubeCreator = cube === dataCubes[0]

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
          floatCube.material,
          {
            opacity: 0,
            delay: floatCubeDuration - 1,
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

    const dataCubeProtrudingHeight = 40
    timeline
      .to(cube.scale, {
        y: 1 + (dataCubeProtrudingHeight * 2) / 100,
        duration: getMoveTime(dataCubeProtrudingHeight),
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
          duration: getMoveTime(dataCubeProtrudingHeight),
        },
        'onDataCubeScaleEnd',
      )

    return timeline
  }
}
