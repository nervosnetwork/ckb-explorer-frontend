import React from 'react'
import { shallow } from 'enzyme'
import SearchFail from '../../pages/SearchFail'

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/welcome',
    hash: '',
    search: '',
    state: '',
  }),
}))

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<SearchFail />)

    expect(app).toBeDefined()
  })
})
