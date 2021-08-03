import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import { HighLightLink } from '../../components/Text'

describe('Text Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = (
      <BrowserRouter>
        <HighLightLink value="value" to="to" tooltip="tooltip" />
      </BrowserRouter>
    )
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(HighLightLink)).toHaveLength(1)
  })
})
