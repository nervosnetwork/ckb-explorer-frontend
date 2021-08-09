import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import SimpleButton from '../../components/SimpleButton'

describe('SimpleButton Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = (
      <SimpleButton>
        <div className="button__child">children</div>
      </SimpleButton>
    )
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.button__child').text()).toBe('children')
  })
})
