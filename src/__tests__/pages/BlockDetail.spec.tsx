import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import BlockDetail from '../../pages/BlockDetail'
import initState from '../../contexts/states'
import * as AppContext from '../../contexts/providers'
import blockMock from '../../__mocks__/block'

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
    const app = shallow(<BlockDetail />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<BlockDetail />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('shallow renders', async () => {
    const contextAppState: State.AppState = {
      ...initState,
      blockState: blockMock(),
    }
    jest.spyOn(AppContext, 'useAppState').mockImplementation(() => contextAppState)
    const wrapper = shallow(<BlockDetail />)
    await Promise.resolve()
    expect(wrapper).toMatchSnapshot()
  })
})
