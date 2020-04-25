import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import DecimalCapacity from '../../components/DecimalCapacity'
import { DecimalPartPanel, DecimalZerosPanel } from '../../components/DecimalCapacity/styled'

describe('DecimalCapacity Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <DecimalCapacity value="128.1234" />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(DecimalPartPanel)).toHaveLength(1)
    expect(wrapper.find(DecimalPartPanel).text()).toBe('.1234')
    expect(wrapper.find(DecimalZerosPanel)).toHaveLength(1)
    expect(wrapper.find(DecimalZerosPanel).text()).toBe('0000')
  })
})
