import styled from 'styled-components'

export const HashCardPanel = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  border-radius: 6px;
  background-color: #fff;
  padding: 0 40px;
  margin-bottom: 18px;

  @media (max-width: 750px) {
    padding: 0 16px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }

  .hashCardContentPanel {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    position: relative;

    @media (max-width: 750px) {
      height: auto;
      flex-direction: ${(props: { isColumn: boolean }) => (props.isColumn ? 'column' : 'row')};
      align-items: ${(props: { isColumn: boolean }) => (props.isColumn ? 'flex-start' : 'center')};
      padding: 12px 0;
    }
  }

  .hashIcon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  .hashTitle {
    font-size: 24px;
    font-weight: 600;
    color: #000;
    white-space: nowrap;

    @media (max-width: 750px) {
      font-size: 20px;
    }
  }

  .hashCardHashContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  #hashText {
    min-width: 0;
    margin-left: 20px;
    font-size: 18px;
    color: #000;
    transform: translateY(3px);

    @media (max-width: 750px) {
      font-size: 13px;
      margin-left: ${(props: { isColumn: boolean }) => (props.isColumn ? '0px' : '10px')};
      font-weight: 500;
      transform: translateY(1px);
    }
  }

  .hashCopyIcon {
    cursor: pointer;
    margin-left: 20px;
    display: flex;
    align-items: center;

    @media (max-width: 750px) {
      margin-left: 10px;
      transform: translateY(3px);
    }

    > img {
      width: 21px;
      height: 24px;

      @media (max-width: 750px) {
        width: 16px;
        height: 18px;
        margin-bottom: 3px;
      }
    }
  }

  #hashValue {
    color: #fff;
    position: absolute;
    bottom: -30px;
  }

  .hashVesting {
    color: ${props => props.theme.primary};
    margin-left: 12px;
    margin-top: 6px;

    &:hover {
      color: ${props => props.theme.primary};
    }

    @media (max-width: 750px) {
      margin-top: 3px;
      margin-left: 6px;
    }
  }
`

export const LoadingPanel = styled.div`
  width: 100%;
`
