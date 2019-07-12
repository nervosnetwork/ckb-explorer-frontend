import { formatData, parseTime } from '../src/utils/date'

describe('Date methods tests', () => {

  it('format date data', async () => {
    expect(formatData(2)).toBe("02")
    expect(formatData(10)).toBe(10)
  })

  it('parse time', async () => {
    expect(parseTime(5500000)).toBe("1 h 31 m 40 s")
    expect(parseTime(1000000)).toBe('16 m 40 s')
    expect(parseTime(60000)).toBe('1 m 0 s')
    expect(parseTime(12233)).toBe('12.23 s')
  })

})