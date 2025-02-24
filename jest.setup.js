const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock @nervina-labs/dob-render
jest.mock('@nervina-labs/dob-render', () => ({
  config: {
    setDobDecodeServerURL: jest.fn(),
    setQueryBtcFsFn: jest.fn(),
  },
  renderByTokenKey: jest.fn(),
  svgToBase64: jest.fn()
}))
