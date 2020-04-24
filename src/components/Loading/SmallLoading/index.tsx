import React from 'react'
import LoadingImage from '../../../assets/loading.gif'
import LoadingBlueImage from '../../../assets/blue_loading.gif'
import { isMainnet } from '../../../utils/chain'
import { SmallLoadingPanel } from './styled'

export default () => {
  return (
    <SmallLoadingPanel>
      <img src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    </SmallLoadingPanel>
  )
}
