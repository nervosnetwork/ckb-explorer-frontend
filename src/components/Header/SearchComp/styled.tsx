import styled from 'styled-components'
import SimpleButton from '../../SimpleButton'

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;
  height: 38px;
  width: 440px;

  @media (max-width: 750px) {
    padding: 40px 15px;
    height: 38px;
    width: 100%;
  }

  @media (max-width: 1440px) {
    margin-right: 24px;
  }

  @media (max-width: 1920px) {
    margin-right: 40px;
  }
`

export const HeaderSearchBarPanel = styled(SimpleButton)`
  display: flex;
  align-items: center;
  margin-right: 30px;

  > img {
    width: 18px;
    height: 18px;
  }
`
