import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Filter from '../../components/Search/Filter'
import { FilterPanel } from '../../components/Search/Filter/styled'

describe('Filter Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Filter />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(FilterPanel)).toHaveLength(1)
  })
})
