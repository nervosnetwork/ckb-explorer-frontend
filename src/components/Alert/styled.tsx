import styled from 'styled-components'

export const AlertPanel = styled.div`
  width: 100%;
  height: 48px;
  background: #fa8f00;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 120px;
  color: white;
  font-size: 14px;
  font-weight: 450;

  @media (max-width: 1440px) {
    padding: 0 100px;
  }

  @media (max-width: 1200px) {
    padding: 0 45px;
    height: 64px;
  }

  @media (max-width: 750px) {
    padding: 8px 18px;
    height: ${(props: { isEn: boolean }) => (props.isEn ? '120px' : '100px')};
    flex-direction: column;
    align-items: flex-start;
  }

  .alert__dismiss__panel {
    @media (max-width: 750px) {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }

  .alert__dismiss {
    width: 100px;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    border: solid 1px #fff;
    text-align: center;

    @media (max-width: 1200px) {
      margin-left: 30px;
    }
  }
`
