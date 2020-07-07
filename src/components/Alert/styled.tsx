import styled from 'styled-components'

export const AlertPanel = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 9000;

  > div {
    width: 100%;
    height: 48px;
    background: #fa8f00;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 120px;
    color: white;

    @media (max-width: 1440px) {
      padding: 0 100px;
    }

    @media (max-width: 1200px) {
      padding: 0 45px;
    }

    @media (max-width: 750px) {
      padding: 0 18px;
    }
  }
`
