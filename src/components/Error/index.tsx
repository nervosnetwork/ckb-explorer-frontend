import React from 'react'
import styled from 'styled-components'
import PCDataNotFoundImage from '../../assets/pc_data_not_found.png'

const ErrorPanel = styled.div`
  margin-top: 60px;

  @media (max-width: 700px) {
    margin-top: 30px;
  }

  > img {
    width: 1038px;
    height: 480px;
    margin: 0 auto;

    @media (max-width: 700px) {
      width: 282px;
      height: 130px;
    }
  }
`

export default () => {
  return (
    <ErrorPanel>
      <img alt="data not fonund" src={PCDataNotFoundImage} />
    </ErrorPanel>
  )
}
