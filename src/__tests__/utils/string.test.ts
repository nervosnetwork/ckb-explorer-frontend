import BigNumber from 'bignumber.js'
import { TextDecoder } from 'util'
import {
  startEndEllipsis,
  hexToUtf8,
  addPrefixForHash,
  handleBigNumber,
  parseFloorDecimal,
  handleBigNumberFloor,
  containSpecialChar,
} from '../../utils/string'

describe('String methods tests', () => {
  it('start end ellipsis', async () => {
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')).toBe('0xckt1q9gry5zgmc...5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 16)).toBe(
      '0xckt1q9gry5zgmc...gdnkkmkw5pqe5ge4',
    )
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 3)).toBe('0xckt1q9gry5zgmc...ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 3, 4)).toBe('0xck...ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 100, 80)).toBe(
      '0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4',
    )
    expect(startEndEllipsis('0xckt1q9gr')).toBe('0xckt1q9gr')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', -2, 4)).toBe(
      '0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4',
    )
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 2, -4)).toBe(
      '0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4',
    )
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', -2, -4)).toBe(
      '0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4',
    )
  })

  describe('Test hex to utf8', () => {
    beforeAll(() => {
      globalThis.TextDecoder = TextDecoder as any
    })

    afterAll(() => {
      globalThis.TextDecoder = undefined as any
    })

    it('convert hex to utf8', async () => {
      expect(hexToUtf8('0x68656c6c6f')).toBe('hello')
      expect(hexToUtf8('0x6e6572766f73')).toBe('nervos')
    })
  })

  it('search text correction', async () => {
    // block number
    expect(addPrefixForHash('59003')).toBe('59003')
    // block hash
    expect(addPrefixForHash('0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8')).toBe(
      '0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8',
    )
    expect(addPrefixForHash('6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8')).toBe(
      '0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8',
    )
    // tx hash
    expect(addPrefixForHash('0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5')).toBe(
      '0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5',
    )
    expect(addPrefixForHash('56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5')).toBe(
      '0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5',
    )
    // lock hash
    expect(addPrefixForHash('0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5')).toBe(
      '0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5',
    )
    expect(addPrefixForHash('5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5')).toBe(
      '0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5',
    )
    // address
    expect(addPrefixForHash('ckt1q9gry5zg8u2h8dzzrr2vz253jxd932rrheq4527rxr7493')).toBe(
      'ckt1q9gry5zg8u2h8dzzrr2vz253jxd932rrheq4527rxr7493',
    )
    // other
    expect(addPrefixForHash('azusa')).toBe('azusa')
    expect(addPrefixForHash('2233')).toBe('2233')
  })

  it('containSpecialChar', async () => {
    expect(containSpecialChar('09udsASHY')).toBe(false)
    expect(containSpecialChar('09udsA]^&*SHY')).toBe(true)
    expect(containSpecialChar('09udsA()@SHY')).toBe(true)
    expect(containSpecialChar('09uds【』！SHY')).toBe(true)
    expect(containSpecialChar('09uds.SHY')).toBe(true)
  })

  it('handleBigNumber', async () => {
    expect(handleBigNumber(new BigNumber(102300))).toBe('102.3K')
    expect(handleBigNumber(new BigNumber(12233435))).toBe('12.233435M')
    expect(handleBigNumber(new BigNumber(102300), 2)).toBe('102.30K')
    expect(handleBigNumber(new BigNumber(12233435), 3)).toBe('12.233M')
  })

  it('handleBigNumberFloor', async () => {
    expect(handleBigNumberFloor(new BigNumber(102789))).toBe('102K')
    expect(handleBigNumberFloor(new BigNumber(12789789))).toBe('12M')
    expect(handleBigNumberFloor(new BigNumber(102789), 2)).toBe('102.78K')
    expect(handleBigNumberFloor(new BigNumber(12789789), 3)).toBe('12.789M')
    expect(handleBigNumberFloor(new BigNumber(-102789), 2)).toBe('-102.78K')
    expect(handleBigNumberFloor(new BigNumber(-12789789), 3)).toBe('-12.789M')
  })

  it('parseFloorDecimal', async () => {
    expect(parseFloorDecimal(922625850.717)).toBe(922625850)
    expect(parseFloorDecimal(922625850.7178, 2)).toBe(922625850.71)
    expect(parseFloorDecimal(922625850.7178, 3)).toBe(922625850.717)
    expect(parseFloorDecimal(-922625850.7178, 2)).toBe(-922625850.71)
    expect(parseFloorDecimal(-922625850.7178, 3)).toBe(-922625850.717)
  })
})
