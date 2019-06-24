import { validNumber, startEndEllipsis, parseLongAddressHash, hexToUtf8, prefixHex } from '../src/utils/string'

describe('String methods tests', () => {

  it('parse valid number', async () => {
    const a = undefined
    expect(validNumber(a, 10)).toBe(10)
    expect(validNumber(2, 10)).toBe(10)
    expect(validNumber('2', 10)).toBe(2)
  })

  it('end ellipsis', async () => {
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4')).toBe('0xckt1q9gry5zgmc...5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 16)).toBe('0xckt1q9gry5zgmc...gdnkkmkw5pqe5ge4')
    expect(startEndEllipsis('0xckt1q9gry5zgmceslalm5xwn20v0krjpsugdnkkmkw5pqe5ge4', 3)).toBe('0xckt1q9gry5zgmc...ge4')
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

  it('add prefix for hex string', async () => {
    expect(prefixHex("0x6efece8a4bdd583673ac80819cd96dc455f4e39699daf622dd8603552ff89e4e")).toBe("0x6efece8a4bdd583673ac80819cd96dc455f4e39699daf622dd8603552ff89e4e")
    expect(prefixHex("6efece8a4bdd583673ac80819cd96dc455f4e39699daf622dd8603552ff89e4e")).toBe("0x6efece8a4bdd583673ac80819cd96dc455f4e39699daf622dd8603552ff89e4e")
    expect(prefixHex("azusa")).toBe("azusa")
    expect(prefixHex("2233")).toBe("0x2233")
  })
})
