import React from 'react'
import styled from 'styled-components'
import PCDataNotFoundImage from '../../assets/pc_data_not_found.png'
import MobileDataNotFoundImage from '../../assets/mobile_data_not_found.png'
import { isMobile } from '../../utils/screen'

const ErrorPanel = styled.div`
  margin: 112px 0 203px 0;

  @media (max-width: 750px) {
    margin: 120px 0 130px 0;
  }

  > img {
    width: 1038px;
    height: 480px;
    margin: 0 auto;

    @media (max-width: 750px) {
      width: 282px;
      height: 130px;
    }
  }
`

export default () => {
  return (
    <ErrorPanel>
      <img alt="data not found" src={isMobile() ? MobileDataNotFoundImage : PCDataNotFoundImage} />
    </ErrorPanel>
  )
}
