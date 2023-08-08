import BigNumber from 'bignumber.js'
import { handleAxis, parseInterval, handleLogGroupAxis, handleStepGroupAxis, parseNumericAbbr } from '../../utils/chart'

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

  it('handleLogGroupAxis', async () => {
    expect(handleLogGroupAxis(new BigNumber(102300))).toBe('[10K, 102K]')
    expect(handleLogGroupAxis(new BigNumber(12233435))).toBe('[1M, 12M]')
    expect(handleLogGroupAxis(new BigNumber(12232352000), '+')).toBe('[1G, 12G+]')
    expect(handleLogGroupAxis(new BigNumber(122))).toBe('[0, 122]')
  })

  it('handleStepGroupAxis', async () => {
    expect(handleStepGroupAxis(1000, 100)).toBe('[900, 1000]')
    expect(handleStepGroupAxis(2500, 500)).toBe('[2000, 2500]')
    expect(handleStepGroupAxis(2000, 200, '+')).toBe('[1800, 2000+]')
    expect(handleStepGroupAxis(1600)).toBe('[1500, 1600]')
  })

  it('parseInterval', async () => {
    expect(parseInterval(5523434, 2345)).toBe(290000)
    expect(parseInterval(123454, 10)).toBe(6300)
    expect(parseInterval(239, 1)).toBe(13)
    expect(parseInterval(23289, 0)).toBe(1300)
  })

  it('parseNumericAbbr', async () => {
    expect(parseNumericAbbr(new BigNumber(102300))).toBe('102.3K')
    expect(parseNumericAbbr(new BigNumber(12233435))).toBe('12.233435M')
    expect(parseNumericAbbr(new BigNumber(102300), 2)).toBe('102.30K')
    expect(parseNumericAbbr(new BigNumber(12233435), 3)).toBe('12.233M')
    expect(parseNumericAbbr(new BigNumber(122), 2)).toBe('122.00')
    expect(parseNumericAbbr(new BigNumber(122), 2, true)).toBe('122')
    expect(parseNumericAbbr(new BigNumber(12233435), 0)).toBe('12M')
    expect(parseNumericAbbr(new BigNumber(1223343500), 0)).toBe('1B')
    expect(parseNumericAbbr(new BigNumber(1223343500), 2)).toBe('1.22B')
  })
})
