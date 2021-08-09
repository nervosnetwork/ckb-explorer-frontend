import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Toast from '../../components/Toast'

describe('Toast Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Toast />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
  })
})
