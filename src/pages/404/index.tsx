import React from 'react'
import styled from 'styled-components'
import Content from '../../components/Content'
import PCNotFoundIcon from '../../assets/pc_404.png'
import MobileNotFoundIcon from '../../assets/mobile_404.png'
import { isMobile } from '../../utils/screen'

const NotFoundPanel = styled.div`
  width: 100%;
  margin-top: 120px;
  margin-bottom: 140px;
`

const NotFoundImage = styled.img`
  width: 1038px;
  height: 480px;
  display: block;
  margin: 0 auto;

  @media (max-width: 700px) {
    width: 282px;
    height: 130px;
  }
`

export default () => {
  return (
    <Content>
      <NotFoundPanel className="container">
        <NotFoundImage src={isMobile() ? MobileNotFoundIcon : PCNotFoundIcon} alt="404" />
      </NotFoundPanel>
    </Content>
  )
}
