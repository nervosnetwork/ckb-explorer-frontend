import * as timezoneMock from 'timezone-mock'
import * as MockDate from 'mockdate'
import {
  formatData,
  parseTime,
  parseTimeNoSecond,
  parseDiffDate,
  parseHourFromMinute,
  parseHourFromMillisecond,
  parseSimpleDate,
  parseSimpleDateNoSecond,
  getCurrentYear,
} from '../../utils/date'

describe('Date methods tests', () => {
  beforeAll(() => {
    timezoneMock.register('UTC')
  })

  it('format date data', async () => {
    expect(formatData(2)).toBe('02')
    expect(formatData(10)).toBe(10)
  })

  it('parse time', async () => {
    expect(parseTime(5500000)).toBe('1 h 31 m 40 s')
    expect(parseTime(1000000)).toBe('16 m 40 s')
    expect(parseTime(60000)).toBe('1 m 0 s')
    expect(parseTime(12233)).toBe('12.23 s')
  })

  it('parse time no second', async () => {
    expect(parseTimeNoSecond(13465691)).toBe('3 h 44 m')
    expect(parseTimeNoSecond(19895691)).toBe('5 h 31 m')
  })

  it('parse diff date', async () => {
    expect(parseDiffDate(1577110366093, 1579568429375)).toBe('28 days 10 hrs')
    expect(() => {
      parseDiffDate(1579568429375, 1577110366093)
    }).toThrow('End timestamp must be bigger than start timestamp')
  })

  it('parse hour from minute', async () => {
    expect(parseHourFromMinute(188)).toBe(3.13)
    expect(parseHourFromMinute(192)).toBe(3.2)
    expect(parseHourFromMinute(240)).toBe(4)
    expect(parseHourFromMinute(280)).toBe(4.67)
  })

  it('parse hour from millisecond', async () => {
    expect(parseHourFromMillisecond('14252577')).toBe(3.96)
    expect(parseHourFromMillisecond('2000000000')).toBe(555.56)
  })

  it('parseSimpleDate', async () => {
    expect(parseSimpleDate(1588734510000)).toBe('2020/05/06 03:08:30')
    expect(parseSimpleDate(1588651000000)).toBe('2020/05/05 03:56:40')
  })

  it('parseSimpleDateNoSecond', async () => {
    expect(parseSimpleDateNoSecond(1588734510000)).toBe('2020-05-06 03:08')
    expect(parseSimpleDateNoSecond(1588734510000, '/')).toBe('2020/05/06 03:08')
    expect(parseSimpleDateNoSecond(1588734510, '/', false)).toBe('2020/05/06 03:08')
    expect(parseSimpleDateNoSecond(1588651000000, '/')).toBe('2020/05/05 03:56')
  })

  it('getCurrentYear', async () => {
    MockDate.set(1588694400000)
    expect(getCurrentYear()).toBe(2020)
  })
})
