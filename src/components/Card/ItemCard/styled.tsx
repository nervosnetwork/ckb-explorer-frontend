import styled from 'styled-components'

export const ItemCardPanel = styled.div`
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 15px 40px;

  @media (max-width: 1000px) {
    font-size: 13px;
  }

  @media (max-width: 750px) {
    font-size: 13px;
    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 10px 20px;
  }
`

export const ItemContentPanel = styled.div`
  margin-right: 45px;
  display: flex;
  flex: 1;
  flex-direction: column;

  @media (max-width: 1200px) {
    width: 100%;
    margin-right: 0px;
  }
`

export const ItemDetailPanel = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (min-width: 750px) {
    height: 20px;
    margin-top: 14px;
  }

  @media (min-width: 1200px) {
    height: 20px;
    margin-top: 14px;
  }

  @media (max-width: 750px) {
    justify-content: normal;
    flex-direction: column;
    align-items: flex-start;

    &:after {
      content: '';
      background: #e2e2e2;
      height: 1px;
      width: 100%;
      margin: 10px 0px 0px 0px;
      display: ${({ hideLine }: { hideLine: boolean }) => (hideLine ? 'none' : 'block')};
      transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
    }
  }

  .item__detail__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 0px;

    @media (max-width: 750px) {
      width: 100%;
      margin-left: 0px;
    }
  }

  .item__detail__value {
    margin-left: 15px;
    display: flex;
    font-size: 16px;
    color: #000000;

    @media (max-width: 750px) {
      margin-left: 0px;
      word-wrap: break-word;
      word-break: break-all;
      width: 100%;
    }

    a {
      color: ${props => props.theme.primary};
    }

    a:hover {
      color: ${props => props.theme.primary};
    }
  }

  .block_pointer {
    cursor: pointer;
  }
`
