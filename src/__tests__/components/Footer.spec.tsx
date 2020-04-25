import React, { ReactElement } from 'react'
import renderer from 'react-test-renderer'
import Footer from '../../components/Footer'

describe('Footer Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Footer />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
