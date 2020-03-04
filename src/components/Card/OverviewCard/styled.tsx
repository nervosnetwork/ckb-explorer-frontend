import styled from 'styled-components'

export const OverviewCardPanel = styled.div`
  width: 100%;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  margin-top: 5px;
  padding: 10px 40px 30px 40px;
  background-color: #ffffff;

  /* common */
  color: #000000;
  font-size: 16px;

  @media (max-width: 1000px) {
    font-size: 13px;
  }

  @media (max-width: 750px) {
    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 5px 20px 15px 20px;

    font-size: 13px;
  }
`

export const OverviewContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 750px) {
    flex-direction: column;
  }

  > span {
    width: 1px;
    height: ${({ length }: { length: number }) => `${length * 40 - 20}px`};
    background: #e2e2e2;
    margin: 20px 0px 0px 0px;
    transform: ${() => `scaleX(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};

    @media (max-width: 750px) {
      display: none;
    }
  }

  .overview_content__left_items {
    margin-right: 45px;
    display: flex;
    flex: 1;
    flex-direction: column;

    @media (max-width: 750px) {
      width: 100%;
      margin-right: 0px;
    }
  }

  .overview_content__right_items {
    margin-left: 45px;
    display: flex;
    flex: 1;
    flex-direction: column;

    @media (max-width: 750px) {
      width: 100%;
      margin-left: 0px;
    }
  }
`

export const OverviewItemPanel = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (min-width: 750px) {
    height: 20px;
    margin-top: 20px;
  }

  @media (max-width: 750px) {
    margin-top: 10px;
    justify-content: normal;
    flex-direction: column;
    align-items: flex-start;

    &:after {
      content: '';
      background: #e2e2e2;
      height: 1px;
      width: 100%;
      display: ${({ hiddenLine }: { hiddenLine: boolean }) => (hiddenLine ? 'none' : 'block')};
      margin: 10px 0px 0px 0px;

      transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
    }
  }

  .overview_item__title {
    font-weight: 500;

    @media (max-width: 750px) {
      width: 100%;
    }
  }

  .overview_item__value {
    margin-left: 15px;
    display: flex;

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
