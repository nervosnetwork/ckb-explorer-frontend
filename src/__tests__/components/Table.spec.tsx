import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import { TableTitleItem, TableContentItem, TableMinerContentItem } from '../../components/Table'
import { TableTitleRowItem, TableContentRowItem } from '../../components/Table/styled'
import { BrowserRouter } from 'react-router-dom'

describe('Table Component', () => {
  let tableTitleItem: ReactElement
  let tableContentItem: ReactElement
  let tableMinerContentItem: ReactElement

  beforeAll(() => {
    tableTitleItem = <TableTitleItem width="10px" title="Table Title" />
    tableContentItem = <TableContentItem width="10px" content="Table Content" />
    tableMinerContentItem = (
      <BrowserRouter>
        <TableMinerContentItem width="10px" content="Table Content" />
      </BrowserRouter>
    )
  })

  it('shallow renders', () => {
    const wrapper1 = renderer.create(tableTitleItem).toJSON()
    expect(wrapper1).toHaveStyleRule('width', '10px')
    expect(wrapper1).toMatchSnapshot()

    const wrapper2 = renderer.create(tableContentItem).toJSON()
    expect(wrapper1).toHaveStyleRule('width', '10px')
    expect(wrapper2).toMatchSnapshot()

    const wrapper3 = renderer.create(tableMinerContentItem).toJSON()
    expect(wrapper3).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(tableTitleItem)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(TableTitleRowItem)).toHaveLength(1)
  })

  it('Component Render', () => {
    const wrapper = shallow(tableContentItem)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(TableContentRowItem)).toHaveLength(1)
  })

  it('Component Render', () => {
    const wrapper = shallow(tableMinerContentItem)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(TableMinerContentItem)).toHaveLength(1)
  })
})
