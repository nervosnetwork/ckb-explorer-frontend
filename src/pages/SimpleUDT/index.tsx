import React from 'react'
import { SUDTContentPanel } from './styled'
import Content from '../../components/Content'
import UDTHashCard from '../../components/Card/HashCard'
import { useParams } from 'react-router'

export default () => {
  const { hash: typeHash } = useParams<{ hash: string }>()
  return (
    <Content>
      <SUDTContentPanel className="container">
        <UDTHashCard title={'sUDT'} hash={typeHash} />
      </SUDTContentPanel>
    </Content>
  )
}
