import React from 'react'
import LoadingImage from '../../assets/loading.gif'
import LoadingBlueImage from '../../assets/blue_loading.gif'
import { isMainnet } from '../../utils/chain'
import { LoadingPanel } from './styled'

export default ({ show }: { show: boolean }) => {
  return show ? (
    <LoadingPanel>
      <img src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    </LoadingPanel>
  ) : null
}
