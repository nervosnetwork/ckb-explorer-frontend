import { Mesh } from 'three'
import { gsap } from 'gsap'
import { singleton } from '../../../utils/util'
import { assert } from '../../../utils/error'
import { CubeOffset, InstancedCubeUnitControl } from './renderUtils'

export const playNewBlockAnime = singleton(_playNewBlockAnime)

const DURATION_TO_PROTRUDE = 5 // duration to protrude
const DELAY_OF_RIPPLE = 10 // change the distance between edges of a ripple

// eslint-disable-next-line no-underscore-dangle
function _playNewBlockAnime(
  cubeOffsets: CubeOffset[],
  getCubeControl: (
    x: number,
    z: number,
  ) =>
    | (InstancedCubeUnitControl & {
        isTextCube: boolean
        isDataCube: boolean
        isFloatCubeCreator: boolean
      })
    | null,
  createFloatCube: () => Mesh,
) {
  return Promise.all(cubeOffsets.map(startCubeAnime))

  function startCubeAnime(offset: CubeOffset): gsap.core.Animation | null {
    const control = getCubeControl(offset.x, offset.z)
    if (control == null) return null
    const { position, onUpdate, isTextCube, isDataCube, isFloatCubeCreator } = control

    const textCubeFirstUpDistance = 40
    const ySpeedPerSecond = 75
    const getMoveTime = (distance: number, multiply = 1) => distance / ySpeedPerSecond / multiply

    if (isTextCube) {
      return gsap
        .timeline()
        .to(position, {
          y: position.y + textCubeFirstUpDistance * 2,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 4),
          onUpdate,
        })
        .to(position, {
          y: -40,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 3),
          onUpdate,
        })
        .to(position, {
          y: position.y + textCubeFirstUpDistance,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 4),
          onUpdate,
        })
        .to(position, {
          y: position.y,
          duration: getMoveTime(DURATION_TO_PROTRUDE * 5),
          onUpdate,
        })
    }

    const distance = Math.sqrt(position.x ** 2 + position.z ** 2)
    const maxDistanceWithReduction = 1000
    const reductionRatio = distance > maxDistanceWithReduction ? 0 : 1 - distance / maxDistanceWithReduction
    const textCubeFirstUpDuration = getMoveTime(textCubeFirstUpDistance, 2) * 4e3

    const timeline = gsap
      .timeline()
      .to(position, {
        delay: (distance + textCubeFirstUpDuration - 500 * reductionRatio) / 2000,
        y: position.y + 40,
        duration: getMoveTime(DURATION_TO_PROTRUDE),
        onUpdate,
      })
      .to(position, {
        delay: getMoveTime(DELAY_OF_RIPPLE),
        y: position.y,
        duration: getMoveTime(DURATION_TO_PROTRUDE),
        onUpdate,
      })

    if (!isDataCube) return timeline

    const createFloatCubeTimeline = () => {
      const moveLength = 1500
      const moveTime = getMoveTime(moveLength, 5)
      const floatCube = createFloatCube()
      assert(!Array.isArray(floatCube.material))
      floatCube.material.opacity = 0
      floatCube.position.copy(position)

      return gsap
        .timeline()
        .addLabel('start')
        .to(
          floatCube.material,
          {
            opacity: 1,
            duration: moveTime * 0.4,
          },
          'start',
        )
        .to(
          floatCube.material,
          {
            opacity: 0,
            delay: moveTime * 0.6,
            duration: moveTime * 0.4,
          },
          'start',
        )
        .to(
          floatCube.position,
          {
            y: moveLength,
            duration: moveTime,
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
            duration: moveTime,
          },
          'start',
        )
    }

    const dataCubeProtrudingHeight = 40
    timeline
      .to(position, {
        y: position.y + dataCubeProtrudingHeight,
        duration: getMoveTime(dataCubeProtrudingHeight),
        onUpdate,
      })
      // ">" The end of the previous animation, "<" The start of previous animation
      .addLabel('onDataCubeScaleEnd', '>')
      .addLabel('onDataCubeScaleStart', '<')
      .add(isFloatCubeCreator ? createFloatCubeTimeline() : [], 'onDataCubeScaleStart')
      .to(
        position,
        {
          delay: getMoveTime(150),
          y: position.y,
          duration: getMoveTime(dataCubeProtrudingHeight),
          onUpdate,
        },
        'onDataCubeScaleEnd',
      )

    return timeline
  }
}
