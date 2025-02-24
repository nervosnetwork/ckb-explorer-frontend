import { getLatest, calculateGraphMetrics } from '../../../../pages/Fiber/Graph/utils'

describe('Fiber Graph Utils', () => {
  describe('getLatest', () => {
    it('should return null for empty list', () => {
      expect(getLatest([])).toBeNull()
    })

    it('should return value and same diff for single item', () => {
      const result = getLatest([{ value: '100' }])
      expect(result).toEqual({
        value: '100',
        diff: 100,
      })
    })

    it('should calculate difference between last two values', () => {
      const result = getLatest([{ value: '100' }, { value: '200' }, { value: '150' }])
      expect(result).toEqual({
        value: '150',
        diff: -50, // 150 - 200
      })
    })
  })

  describe('calculateGraphMetrics', () => {
    const mockData = {
      data: [
        {
          totalNodes: '10',
          totalChannels: '20',
          totalLiquidity: '1000000000', // 10 CKB in shannon
          createdAtUnixtimestamp: '1600000000',
        },
        {
          totalNodes: '15',
          totalChannels: '25',
          totalLiquidity: '2000000000', // 20 CKB in shannon
          createdAtUnixtimestamp: '1600001000',
        },
      ],
    }

    it('should handle undefined input', () => {
      const result = calculateGraphMetrics(undefined)
      expect(result).toEqual({
        nodes: [],
        channels: [],
        capacity: [],
        latest: {
          capacity: null,
          nodes: null,
          channels: null,
        },
      })
    })

    it('should transform data correctly', () => {
      const result = calculateGraphMetrics(mockData)

      // Check nodes
      expect(result.nodes).toEqual([
        { value: '10', timestamp: '1600000000' },
        { value: '15', timestamp: '1600001000' },
      ])

      // Check channels
      expect(result.channels).toEqual([
        { value: '20', timestamp: '1600000000' },
        { value: '25', timestamp: '1600001000' },
      ])

      // Check capacity (converted from shannon to CKB)
      expect(result.capacity).toEqual([
        { value: '10.00', timestamp: '1600000000' },
        { value: '20.00', timestamp: '1600001000' },
      ])

      // Check latest values
      expect(result.latest.nodes).toEqual({
        value: '15',
        diff: 5,
      })
      expect(result.latest.channels).toEqual({
        value: '25',
        diff: 5,
      })
      expect(result.latest.capacity).toEqual({
        value: '20.00',
        diff: 10,
      })
    })

    it('should handle empty data array', () => {
      const result = calculateGraphMetrics({ data: [] })
      expect(result).toEqual({
        nodes: [],
        channels: [],
        capacity: [],
        latest: {
          capacity: null,
          nodes: null,
          channels: null,
        },
      })
    })
  })
})
