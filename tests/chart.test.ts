import { handleAxis, parseInterval, handleGroupAxis } from '../src/utils/chart'
import BigNumber from 'bignumber.js'

describe('Chart tests', () => {
  it('handleAxis', async () => {
    expect(handleAxis(new BigNumber(102300))).toBe('102.3K')
    expect(handleAxis(new BigNumber(12233435))).toBe('12.233435M')
    expect(handleAxis(new BigNumber(102300), 2)).toBe('102.30K')
    expect(handleAxis(new BigNumber(12233435), 3)).toBe('12.233M')
    expect(handleAxis(new BigNumber(122), 2)).toBe('122.00')
    expect(handleAxis(new BigNumber(122), 2, true)).toBe('122')
    expect(handleAxis(new BigNumber(12233435), 0)).toBe('12M')
  })

  it('handleGroupAxis', async () => {
    expect(handleGroupAxis(new BigNumber(102300))).toBe('[10K, 102K]')
    expect(handleGroupAxis(new BigNumber(12233435))).toBe('[1M, 12M]')
    expect(handleGroupAxis(new BigNumber(12232352000), '+')).toBe('[1G, 12G+]')
    expect(handleGroupAxis(new BigNumber(122))).toBe('[0, 122]')
  })

  it('parseInterval', async () => {
    expect(parseInterval(5523434, 2345)).toBe(290000)
    expect(parseInterval(123454, 10)).toBe(6300)
    expect(parseInterval(239, 1)).toBe(13)
    expect(parseInterval(23289, 0)).toBe(1300)
  })
})
