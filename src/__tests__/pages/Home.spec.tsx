import React from 'react'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import * as MockDate from 'mockdate'
import Home from '../../pages/Home'
import * as AppContext from '../../contexts/providers'
import initState from '../../contexts/states'
import { statisticMock, latestBlocksMock, latestTxMock, TipBlockNumberMock } from '../../__mocks__/home'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<Home />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<Home />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('shallow renders', async () => {
    MockDate.set(1588694400000, 480)
    const contextAppState: State.AppState = {
      ...initState,
      statistics: statisticMock(),
      homeBlocks: latestBlocksMock(),
      transactionsState: {
        ...initState.transactionsState,
        transactions: latestTxMock(),
      },
      app: {
        ...initState.app,
        tipBlockNumber: TipBlockNumberMock,
      },
    }
    jest.spyOn(AppContext, 'useAppState').mockImplementation(() => contextAppState)
    const wrapper = renderer
      .create(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      )
      .toJSON()
    await Promise.resolve()
    expect(wrapper).toMatchSnapshot()
  })
})
