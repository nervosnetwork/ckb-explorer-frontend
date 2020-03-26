import styled, { css } from 'styled-components'

export const OverviewCardPanel = styled.div`
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 10px 40px;

  ${(props: { hideShadow?: boolean }) =>
    props.hideShadow &&
    css`
      margin-top: 0px;
      border-radius: 0px;
      box-shadow: 0px 0px 0px 0 #dfdfdf;
      padding: 0px;
    `};

  @media (max-width: 1000px) {
    font-size: 13px;
  }

  @media (max-width: 750px) {
    font-size: 13px;

    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 5px 20px;
    ${(props: { hideShadow?: boolean }) =>
      props.hideShadow &&
      css`
        border-radius: 0px;
        box-shadow: 0px 0px 0px 0 #dfdfdf;
        padding: 0px;
      `};
  }
`

export const OverviewContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 1200px) {
    flex-direction: column;
  }

  > span {
    width: 1px;
    height: ${({ length }: { length: number }) => `${length * 32 - 16}px`};
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

    @media (max-width: 1200px) {
      width: 100%;
      margin-right: 0px;
    }
  }

  .overview_content__right_items {
    margin-left: 45px;
    display: flex;
    flex: 1;
    flex-direction: column;

    @media (max-width: 1200px) {
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
    margin-top: ${({ hasIcon }: { hasIcon: boolean }) => (hasIcon ? '35px' : '16px')};
    margin-bottom: ${({ hasIcon }: { hasIcon: boolean }) => (hasIcon ? '-32px' : '0px')};
  }

  @media (min-width: 1200px) {
    height: 20px;
    margin-top: ${({ hasIcon }: { hasIcon: boolean }) => (hasIcon ? '35px' : '16px')};
  }

  @media (max-width: 750px) {
    margin-top: 12px;
    justify-content: normal;
    flex-direction: column;
    align-items: flex-start;

    &:after {
      content: '';
      background: #e2e2e2;
      height: 1px;
      width: 100%;
      display: ${({ hiddenLine }: { hiddenLine: boolean; hasIcon: boolean; isAsset?: boolean }) =>
        hiddenLine ? 'none' : 'block'};
      margin: 10px 0px 0px 0px;

      transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
    }
  }

  .overview_item__title__panel {
    display: flex;
    align-items: center;

    @media (max-width: 1200px) {
      margin-left: ${({ hasIcon, isAsset }: { hasIcon: boolean; isAsset?: boolean }) =>
        !hasIcon && isAsset ? '60px' : '0px'};
    }

    @media (max-width: 750px) {
      margin-left: 0px;
    }
  }

  .overview_item__icon {
    width: 48px;
    height: 48px;
    margin-right: 10px;

    @media (max-width: 750px) {
      margin-bottom: 10px;
    }

    > img {
      width: 48px;
      height: 48px;
    }
  }

  .overview_item__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 0px;
    font-weight: ${({ hasIcon }: { hasIcon: boolean }) => (hasIcon ? '600' : '400')};

    @media (max-width: 750px) {
      width: 100%;
      margin-left: 0px;
    }
  }

  .overview_item__value {
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
