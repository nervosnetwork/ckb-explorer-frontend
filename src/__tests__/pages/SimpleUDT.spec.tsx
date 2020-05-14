import React from 'react'
import { shallow } from 'enzyme'
import SimpleUDT from '../../pages/SimpleUDT'

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
  useParams: jest.fn().mockReturnValue({ id: '123' }),
}))

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<SimpleUDT />)

    expect(app).toBeDefined()
  })
})
