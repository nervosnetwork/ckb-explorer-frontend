import React from 'react'
import styled from 'styled-components'
import LoadingImage from '../../assets/loading.gif'
import LoadingBlueImage from '../../assets/blue_loading.gif'
import { isMainnet } from '../../utils/chain'

const Loading = styled.div`
  margin: 15px 0;
  text-align: center;

  > img {
    width: 135px;
    height: 39px;
  }

  @media (max-width: 750px) {
    margin: 8px 0;
    > img {
      width: 68px;
      height: 20px;
    }
  }
`

export default () => {
  return (
    <Loading>
      <img src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    </Loading>
  )
}
