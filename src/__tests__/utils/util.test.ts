import { toCamelcase, shannonToCkb, shannonToCkbDecimal, parseSince } from '../../utils/util'

describe('Number methods tests', () => {
  it('pasre simple object to camelcase', async () => {
    interface Data {
      dataName: string
      dataValue: string
    }
    const data = {
      data_name: 'hello',
      data_value: 'world',
    }
    const result: Data | null = toCamelcase(data)
    expect(result).toStrictEqual({
      dataName: 'hello',
      dataValue: 'world',
    })
  })

  it('pasre complex object to camelcase', async () => {
    interface Data {
      dataName: string
      dataValue: {
        aValue: string
        bValue: string
      }
    }
    const data = {
      data_name: 'hello',
      data_value: {
        a_value: 'a',
        b_value: 'b',
      },
    }
    const result: Data | null = toCamelcase(data)
    expect(result).toStrictEqual({
      dataName: 'hello',
      dataValue: {
        aValue: 'a',
        bValue: 'b',
      },
    })
  })

  it('convert shannon to ckb', async () => {
    expect(shannonToCkb(222333)).toBe('0.00222333')
    expect(shannonToCkb(2223232333)).toBe('22.23232333')
    expect(shannonToCkb(2223)).toBe('0.00002223')
    expect(shannonToCkb(2200)).toBe('0.000022')
    expect(shannonToCkb(23)).toBe('0.00000023')
    expect(shannonToCkb(20)).toBe('0.0000002')
    expect(shannonToCkb(3)).toBe('0.00000003')
    expect(shannonToCkb(-3)).toBe('-0.00000003')
    expect(shannonToCkb(0.3)).toBe('0')
    expect(shannonToCkb(0)).toBe('0')
    expect(shannonToCkb('0x66ccff')).toBe('0.06737151')
    expect(shannonToCkb('aswqda')).toBe('0')
    expect(shannonToCkb('false')).toBe('0')
    expect(shannonToCkb('#￥@#￥@')).toBe('0')
  })

  it('convert shannon to ckb with decimal', async () => {
    expect(shannonToCkbDecimal(153088822106905372, 2)).toBe(1530888221.06)
    expect(shannonToCkbDecimal(-153088822106905372, 2)).toBe(-1530888221.06)
    expect(shannonToCkbDecimal(153088822186905372)).toBe(1530888221)
  })

  describe('parse since', () => {
    it('should be absolute epoch', () => {
      expect(parseSince('0x20048e022c001984')).toMatchObject({
        base: 'absolute',
        type: 'epoch',
        value: '6532.48',
      })
    })

    it('should be absolute block', () => {
      expect(parseSince('0x3039')).toMatchObject({
        base: 'absolute',
        type: 'block',
        value: '12346',
      })
    })

    it('should be absolute timestamp', () => {
      expect(parseSince('0x40000000617f7363')).toMatchObject({
        base: 'absolute',
        type: 'timestamp',
        value: '1635742563',
      })
    })

    it('should be relative epoch', () => {
      expect(parseSince('0xa0048e022c001984')).toMatchObject({
        base: 'relative',
        type: 'epoch',
        value: '6532.48',
      })
    })

    it('should be relative block', () => {
      expect(parseSince('0x8000000000000064')).toMatchObject({
        base: 'relative',
        type: 'block',
        value: '101',
      })
    })

    it('should be relative timestamp', () => {
      expect(parseSince('0xc000000000127500')).toMatchObject({
        base: 'relative',
        type: 'timestamp',
        value: '1209600',
      })
    })

    it('should be null', () => {
      expect(parseSince('0x0000000000000000')).toBe(null)
    })
  })
})
