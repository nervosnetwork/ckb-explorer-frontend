import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import ChainType from '../../components/Dropdown/ChainType'

describe('ChainType Dropdown Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <ChainType setShow={() => {}} top={0} left={0} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.chain__type__normal')).toHaveLength(1)
    expect(wrapper.find('.chain__type__selected')).toHaveLength(1)
  })
})
