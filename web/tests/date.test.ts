import { formatData, parseSimpleDate } from '../src/utils/date'

describe('Date methods tests', () => {

  it('format date data', async () => {
    expect("02").toBe(formatData(2))
    expect(10).toBe(formatData(10))
  })

  it('format timestamp', async () => {
    expect("2019/2/24 20:43:20").toBe(parseSimpleDate(1551012200000))
  })

})