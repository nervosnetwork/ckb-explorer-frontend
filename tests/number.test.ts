import { parseHashRate } from '../src/utils/number'

describe('Number methods tests', () => {

  it('parse hash rate', async () => {
    expect(parseHashRate(1234546698945)).toBe("1.23 TH/s")
    expect(parseHashRate(100003439)).toBe("100.00 MH/s")
  })

})