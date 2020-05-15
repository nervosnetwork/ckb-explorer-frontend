import React from 'react'
import { shallow } from 'enzyme'
import NervosDao from '../../pages/NervosDao'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    length: 13,
    push: jest.fn(),
    block: jest.fn(),
    createHref: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    liten: jest.fn(),
    replace: jest.fn(),
    action: 'REPLACE',
    location: null,
  }),
  useLocation: () => ({
    pathname: '/welcome',
    hash: '',
    search: '',
    state: '',
  }),
}))

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<NervosDao />)

    expect(app).toBeDefined()
  })
})
