import React from 'react'
import styled from 'styled-components'
import PCDataNotFoundImage from '../../assets/pc_data_not_found.png'
import { isMobile } from '../../utils/screen'

const ErrorPanel = styled.div`
  margin: 112px 0 243px 0;

  @media (max-width: 700px) {
    margin: 120px 0 130px 0;
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

  > div {
    font-size: 26px;
    text-align: center;
    color: #000000;
    margin-top: 13px;
  }
`

export default ({ message }: { message: string }) => {
  return (
    <ErrorPanel>
      <img alt="data not fonund" src={PCDataNotFoundImage} />
      {!isMobile() && <div>{message}</div>}
    </ErrorPanel>
  )
}
