import React from 'react'
import styled from 'styled-components'
import LoadingImage from '../../assets/loading.gif'

const Loading = styled.div`
  margin: 100px 0;
  > img {
    width: 270px;
    height: 78px;
  }

  @media (max-width: 700px) {
    margin: 60px 0;
    > img {
      width: 135px;
      height: 39px;
    }
  }
`

export default ({ show }: { show: boolean }) => {
  return show ? (
    <Loading>
      <img src={LoadingImage} alt="loading" />
    </Loading>
  ) : null
}
