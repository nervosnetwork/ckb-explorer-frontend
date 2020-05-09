import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Address from '../../pages/Address'

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
    const app = shallow(<Address />)
    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<Address />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('shallow renders', async () => {
    const wrapper = shallow(<Address />)
    expect(wrapper).toMatchSnapshot()
  })
})
