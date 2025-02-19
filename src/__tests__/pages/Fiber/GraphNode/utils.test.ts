import BigNumber from 'bignumber.js'
import { calculateNodeMetrics } from '../../../../pages/Fiber/GraphNode/utils'
import { formalizeChannelAsset } from '../../../../utils/fiber'

// Mock the fiber utils
jest.mock('../../../../utils/fiber', () => ({
  formalizeChannelAsset: jest.fn(),
}))

describe('GraphNode Utils', () => {
  const mockFormalizedAsset = {
    funding: {
      amount: '100',
      symbol: 'CKB',
    },
    close: [
      {
        addr: 'address1',
        amount: '50',
        symbol: 'CKB',
      },
      {
        addr: 'address2',
        amount: '50',
        symbol: 'CKB',
      },
    ],
  }

  beforeEach(() => {
    ;(formalizeChannelAsset as jest.Mock).mockReturnValue(mockFormalizedAsset)
  })

  describe('calculateNodeMetrics', () => {
    const mockChannel = {
      openTransactionInfo: {
        txHash: 'open-tx-hash',
        blockNumber: 1000,
        blockTimestamp: 1600000000,
        address: 'funding-address',
        udtInfo: {
          typeHash: 'udt-type-hash',
          iconFile: 'icon.png',
        },
      },
    }

    const mockClosedChannel = {
      ...mockChannel,
      closedTransactionInfo: {
        txHash: 'close-tx-hash',
        blockNumber: 1100,
        blockTimestamp: 1600001000,
      },
    }

    const mockNode = {
      fiberGraphChannels: [mockChannel, mockClosedChannel],
    }

    it('should separate open and closed channels', () => {
      const result = calculateNodeMetrics(mockNode as any)

      expect(result.openChannels).toHaveLength(1)
      expect(result.closedChannels).toHaveLength(1)
      expect(result.openChannels[0]).toEqual(mockChannel)
      expect(result.closedChannels[0]).toEqual(mockClosedChannel)
    })

    it('should generate transactions for channel operations', () => {
      const result = calculateNodeMetrics(mockNode as any)

      expect(result.transactions).toHaveLength(3) // 2 opens + 1 close

      // Check transaction order (most recent first)
      expect(result.transactions[0].hash).toBe('close-tx-hash')
      expect(result.transactions[0].isOpen).toBe(false)

      // Check transaction details
      const openTx = result.transactions[1]
      expect(openTx).toMatchObject({
        hash: 'open-tx-hash',
        isOpen: true,
        isUdt: true,
        block: {
          number: 1000,
          timestamp: 1600000000,
        },
        accounts: [
          {
            address: 'funding-address',
            amount: '100 CKB',
          },
        ],
      })
    })

    it('should calculate total liquidity from open channels', () => {
      const result = calculateNodeMetrics(mockNode as any)

      const liquidity = result.totalLiquidity.get('udt-type-hash')
      expect(liquidity).toBeDefined()
      expect(liquidity?.symbol).toBe('CKB')
      expect(liquidity?.iconFile).toBe('icon.png')
      expect(liquidity?.amount).toEqual(new BigNumber(100))
    })

    it('should handle empty node with no channels', () => {
      const emptyNode = { fiberGraphChannels: [] }
      const result = calculateNodeMetrics(emptyNode as any)

      expect(result.openChannels).toHaveLength(0)
      expect(result.closedChannels).toHaveLength(0)
      expect(result.transactions).toHaveLength(0)
      expect(result.totalLiquidity.size).toBe(0)
    })

    it('should handle channels without UDT info', () => {
      const nonUdtChannel = {
        openTransactionInfo: {
          txHash: 'tx-hash',
          blockNumber: 1000,
          blockTimestamp: 1600000000,
          address: 'address',
        },
      }

      const node = {
        fiberGraphChannels: [nonUdtChannel],
      }

      const result = calculateNodeMetrics(node as any)

      expect(result.transactions[0].isUdt).toBe(false)
      const liquidity = result.totalLiquidity.get('ckb')
      expect(liquidity).toBeDefined()
    })
  })
})
