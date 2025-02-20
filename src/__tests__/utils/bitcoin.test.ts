import { isValidBTCAddress } from '../../utils/bitcoin'

describe('Bitcoin Utility Functions', () => {
  describe('isValidBTCAddress', () => {
    it('should return true for valid Bitcoin addresses', () => {
      const validAddresses = [
        'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', // P2PKH
        '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc', // P2SH
        'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', // P2WPKH
        'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7', // P2WSH
        'tb1p9lw5w4mcv5a2uvx9gkkhcnvcajza5zvh27yatmagffv2jdwk43aqnw647e', // P2TR
      ]
      validAddresses.forEach(address => {
        expect(isValidBTCAddress(address)).toBe(true)
      })
    })

    it('should return false for invalid Bitcoin addresses', () => {
      const invalidAddresses = [
        'invalidAddress123',
        't1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfN', // Too short
        't3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLz', // Invalid checksum
        'tb1qw508d6qejxtdg4y5r3z5j6q2j0g0g0g0g0g0g0g0', // Invalid Bech32 address
      ]
      invalidAddresses.forEach(address => {
        expect(isValidBTCAddress(address)).toBe(false)
      })
    })
  })
})
