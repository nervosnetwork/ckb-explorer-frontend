import * as timezoneMock from 'timezone-mock'
import * as MockDate from 'mockdate'
import {
  formatData,
  parseTime,
  parseTimeNoSecond,
  parseDateNoTime,
  parseDiffDate,
  parseHourFromMinute,
  parseHourFromMillisecond,
  parseSimpleDate,
  parseSimpleDateNoSecond,
  getCurrentYear,
  parseDate,
  getCSTTime,
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

  it('parse date no time', async () => {
    expect(parseDateNoTime(1588734510)).toBe('2020/05/06')
    expect(parseDateNoTime(1588734510, true)).toBe('05/06')
    expect(parseDateNoTime(1576157854)).toBe('2019/12/12')
    expect(parseDateNoTime(1576157854, false)).toBe('2019/12/12')
    expect(parseDateNoTime(1576157854, true)).toBe('12/12')
    expect(parseDateNoTime(1576157854, false, '-')).toBe('2019-12-12')
    expect(parseDateNoTime(1576157854, true, '-')).toBe('12-12')
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

  it('parseDate', async () => {
    MockDate.set(1588694400000, 480)
    expect(parseDate(1588694380000)).toBe('20s ago')
    expect(parseDate(1588691000000)).toBe('56min 40s ago')

    MockDate.reset()
    timezoneMock.register('UTC')
    expect(parseDate(1588651000000)).toBe('2020/05/05 03:56:40')
  })

  it('getCSTTime', async () => {
    timezoneMock.register('UTC')
    expect(parseSimpleDate(1588651000000)).toBe('2020/05/05 03:56:40')
    MockDate.set(1588651000000, 0)
    expect(getCSTTime()).toBe(1588679800000)
    timezoneMock.register('UTC')
    expect(parseSimpleDate(1588679800000)).toBe('2020/05/05 11:56:40')
  })
})
