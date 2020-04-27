import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import DaoSearch from '../../components/Search/DaoSearch'
import { DaoSearchPanel } from '../../components/Search/DaoSearch/styled'

describe('DaoSearch Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <DaoSearch />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(DaoSearchPanel)).toHaveLength(1)
  })
})
