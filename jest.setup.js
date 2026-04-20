const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const mockDobRenderModule = {
  config: {
    setDobDecodeServerURL: jest.fn(),
    setQueryBtcFsFn: jest.fn(),
  },
  renderByTokenKey: jest.fn(),
  svgToBase64: jest.fn()
}

// Keep both package names mocked because the codebase was migrated from
// @nervina-labs/dob-render to @nervape/dob-render and tests still rely on the
// renderer being stubbed out.
jest.mock('@nervape/dob-render', () => mockDobRenderModule)
jest.mock('@nervina-labs/dob-render', () => mockDobRenderModule)
