import styled from 'styled-components'

export const HashCardPanel = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 0 40px;
  @media (max-width: 750px) {
    padding: 0 16px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }
  .hash__card__content__panel {
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
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }
  .hash__icon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
  .hash__title {
    font-size: 26px;
    font-weight: 600;
    color: #000000;
    white-space: nowrap;
    @media (max-width: 750px) {
      font-size: 15px;
    }
  }
  .hash__card__hash__content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  #hash__text {
    margin-left: 20px;
    font-size: 18px;
    color: #000000;
    transform: translateY(3px);
    @media (max-width: 750px) {
      font-size: 13px;
      margin-left: ${(props: { isColumn: boolean }) => (props.isColumn ? '0px' : '10px')};
      font-weight: 500;
      transform: translateY(1px);
    }
  }
  .hash__copy_icon {
    cursor: pointer;
    margin-left: 20px;
    transform: translateY(6px);
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
  a {
    margin-left: 10px;
    font-size: 18px;
    margin-top: 8px;
    color: ${props => props.theme.primary};
    @media (max-width: 750px) {
      margin-left: 5px;
      font-size: 12px;
      margin-top: 4px;
    }
  }
  a:hover {
    color: ${props => props.theme.primary};
  }
  #hash__value {
    color: #ffffff;
    position: absolute;
    bottom: -30px;
  }
`

export const LoadingPanel = styled.div`
  width: 100%;
`
