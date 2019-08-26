import React from 'react'
import styled from 'styled-components'
import LoadingImage from '../../assets/loading.gif'

const Loading = styled.div`
  margin: 15px 0;
  text-align: center;

  > img {
    width: 135px;
    height: 39px;
  }

  @media (max-width: 700px) {
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
      <img src={LoadingImage} alt="loading" />
    </Loading>
  )
}
