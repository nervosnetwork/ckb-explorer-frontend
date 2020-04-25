import React from 'react'
import { shallow } from 'enzyme'
import Home from '../../pages/Home'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<Home />)

    expect(app).toBeDefined()
  })
})
