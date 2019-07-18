import { parsePageNumber, startEndEllipsis, parseLongAddressHash, hexToUtf8, searchTextCorrection, stringInsert } from '../src/utils/string'

describe('String methods tests', () => {

  it('parse valid number', async () => {
    expect(parsePageNumber('a', 10)).toBe(10)
    expect(parsePageNumber(2, 10)).toBe(10)
    expect(parsePageNumber('2', 10)).toBe(2)
    expect(parsePageNumber('0', 10)).toBe(10)
    expect(parsePageNumber(undefined, 10)).toBe(10)
  })

  it('end ellipsis', async () => {
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')).toBe('0xckt1q9gry5zgmc...5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 16)).toBe('0xckt1q9gry5zgmc...gdnkkmkw5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 3)).toBe('0xckt1q9gry5zgmc...ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 3, 4)).toBe('0xck...ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 100, 80)).toBe('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gr')).toBe('0xckt1q9gr')
  })

  it('parse long address', async () => {
    expect(parseLongAddressHash('ckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')).toBe('ckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')
    expect(parseLongAddressHash('ckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4lalm5xwn20v0krjpsugdnkkmkw5pqe5ge4'))
      .toBe('ckt1q9gry5zgmceslalm5xwn2...krjpsugdnkkmkw5pqe5ge4')
  })

  it('convert hex to utf8', async () => {
    expect(hexToUtf8('0x68656c6c6f')).toBe('hello')
    expect(hexToUtf8('0x6e6572766f73')).toBe('nervos')
    expect(hexToUtf8('6e6572766f73')).toBe('nervos')
  })

  it('search text correction', async () => {
    // block number
    expect(searchTextCorrection("59003")).toBe("59003")
    // block hash
    expect(searchTextCorrection("0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8")).toBe("0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8")
    expect(searchTextCorrection("6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8")).toBe("0x6983738437a6309ebca57186d3ae2f4ec168b4ace4abecd1625f6375633713b8")
    // tx hash
    expect(searchTextCorrection("0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5")).toBe("0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5")
    expect(searchTextCorrection("56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5")).toBe("0x56dde24a962eb5e0c77c0c0ea99cb5dfb0388012553535d447d105b96a13eeb5")
    // lock hash
    expect(searchTextCorrection("0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5")).toBe("0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5")
    expect(searchTextCorrection("5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5")).toBe("0x5de8c4d303266934f64be2acc928bbb82d07a34e9932dabcfa64761604fa15e5")
    // address
    expect(searchTextCorrection("ckt1q9gry5zg8u2h8dzzrr2vz253jxd932rrheq4527rxr7493")).toBe("ckt1q9gry5zg8u2h8dzzrr2vz253jxd932rrheq4527rxr7493")
    // other
    expect(searchTextCorrection("azusa")).toBe("azusa")
    expect(searchTextCorrection("2233")).toBe("2233")
  })

  it('string insert', async () => {
    expect(stringInsert("azusa", 3, "_")).toBe("azu_sa")
    expect(stringInsert("azusa", 8, "_")).toBe("azusa_")
    expect(stringInsert("azusa", 0, "_")).toBe("_azusa")
    expect(stringInsert("azusa", -1, "_")).toBe("azus_a")
    expect(stringInsert("azusa", -8, "_")).toBe("_azusa")
  })
})
