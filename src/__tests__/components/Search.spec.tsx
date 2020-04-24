import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Search from '../../components/Search'
import { SearchInputPanel } from '../../components/Search/styled'

describe('Search Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Search />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(SearchInputPanel)).toHaveLength(1)
  })
})
