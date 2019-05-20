import { formatData } from '../src/utils/date'

describe('Date methods tests', () => {

  it('format date data', async () => {
    expect(formatData(2)).toBe("02")
    expect(formatData(10)).toBe(10)
  })

})