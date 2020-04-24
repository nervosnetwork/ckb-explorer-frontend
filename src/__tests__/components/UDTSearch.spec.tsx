import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import UDTSearch from '../../components/Search/UDTSearch'
import { UDTSearchPanel } from '../../components/Search/UDTSearch/styled'

describe('UDTSearch Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <UDTSearch typeHash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8" />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(UDTSearchPanel)).toHaveLength(1)
  })
})
