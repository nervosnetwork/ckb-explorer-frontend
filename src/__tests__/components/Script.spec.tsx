import React from 'react'
import { shallow } from 'enzyme'
import Script from '../../components/Script'
import renderer from 'react-test-renderer'

describe('Script Component', () => {
  it('shallow renders', () => {
    const wrapper = renderer
      .create(
        <Script
          script={{
            args: '0x5f77c1d1a0e384d5c7d7c02788b51e0a296d4ec13cd7b66bb16f1650ebbfd74c',
            codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
            hashType: 'data',
          }}
        />,
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(
      <Script
        script={{
          args: '0x5f77c1d1a0e384d5c7d7c02788b51e0a296d4ec13cd7b66bb16f1650ebbfd74c',
          codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
          hashType: 'data',
        }}
      />,
    )
    expect(wrapper).toBeDefined()
    expect(
      wrapper
        .find('.script__code_hash')
        .text()
        .startsWith('0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212'),
    ).toBe(true)
  })
})
