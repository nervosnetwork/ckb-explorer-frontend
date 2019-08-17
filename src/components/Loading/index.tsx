import React from 'react'
import styled from 'styled-components'
import loadingImage from '../../assets/loading.gif'

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default () => {
  return (
    <LoadingDiv>
      <img alt="loading" src={loadingImage} />
    </LoadingDiv>
  )
}
