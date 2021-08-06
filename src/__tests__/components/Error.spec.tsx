import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Error from '../../components/Error'
import { ErrorPanel } from '../../components/Error/styled'

describe('Error Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Error />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(ErrorPanel).children().length).toBe(1)
  })
})
