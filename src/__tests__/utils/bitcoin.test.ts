import { isValidBTCAddress } from '../../utils/bitcoin'

describe('Bitcoin Utility Functions', () => {
  describe('isValidBTCAddress', () => {
    const VALID_MAINNET_ADDRESSES = new Map([
      ['P2PKH', '1HxbTvKCZMak4rdzVx5DT8LTtT5i1ph1CA'],
      ['P2SH', '3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN'],
      ['P2WPKH', 'bc1qnkyhslv83yyp0q0suxw0uj3lg9drgqq9c0auzc'],
      ['P2WSH', 'bc1qvccu84fawax242ghtm4gnz345hlcslumhlhtx8gp98n2zedg9naqhsuyqt'],
      ['P2TR', 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0'],
    ])

    const VALID_TESTNET_ADDRESSES = new Map([
      ['P2PKH', 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'],
      ['P2SH', '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc'],
      ['P2WPKH', 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'],
      ['P2WSH', 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7'],
      ['P2TR', 'tb1p9lw5w4mcv5a2uvx9gkkhcnvcajza5zvh27yatmagffv2jdwk43aqnw647e'],
    ])

    VALID_MAINNET_ADDRESSES.forEach((address, type) => {
      it(`should return true for valid ${type} Bitcoin mainnet address: ${address}`, () => {
        expect(isValidBTCAddress(address, true)).toBe(true)
      })
    })

    VALID_TESTNET_ADDRESSES.forEach((address, type) => {
      it(`should return true for valid ${type} Bitcoin testnet address: ${address}`, () => {
        expect(isValidBTCAddress(address, false)).toBe(true)
      })
    })

    const INVALID_ADDRESSES = [
      'invalidAddress123',
      't1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfN', // Too short
      't3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLz', // Invalid checksum
      'tb1qw508d6qejxtdg4y5r3z5j6q2j0g0g0g0g0g0g0g0', // Invalid Bech32 address
    ]
    INVALID_ADDRESSES.forEach(address => {
      it(`should return false for invalid Bitcoin address: ${address}`, () => {
        expect(isValidBTCAddress(address)).toBe(false)
      })
    })
  })
})
