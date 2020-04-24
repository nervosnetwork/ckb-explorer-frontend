import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Pagination from '../../components/Pagination'
import { PaginationPanel, PaginationLeftItem, PaginationRightItem } from '../../components/Pagination/styled'

describe('Pagination Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Pagination currentPage={1} totalPages={10} onChange={() => {}} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(PaginationPanel)).toHaveLength(1)
    expect(wrapper.find(PaginationLeftItem)).toHaveLength(1)
    expect(wrapper.find(PaginationRightItem)).toHaveLength(1)
  })
})
