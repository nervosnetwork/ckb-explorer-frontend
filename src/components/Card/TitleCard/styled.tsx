import styled from 'styled-components'

interface TitleCardPanelProps {
  isSingle?: boolean
  hasRear?: boolean
}

export const TitleCardPanel = styled.div`
  width: 100%;
  background-color: #fff;
  height: ${(props: TitleCardPanelProps) => (props.isSingle ? '58px' : '50px')};
  padding: ${(props: TitleCardPanelProps) => (props.isSingle ? '0 40px' : '0')};
  display: flex;
  flex-direction: row;
  justify-content: ${(props: TitleCardPanelProps) => (props.hasRear ? 'space-between' : 'flex-start')};
  align-items: ${(props: TitleCardPanelProps) => (props.isSingle ? 'center' : 'flex-start')};
  border-radius: ${(props: TitleCardPanelProps) => (props.isSingle ? '6px 6px 0 0' : '0')};
  box-shadow: ${(props: TitleCardPanelProps) => (props.isSingle ? '2px 2px 6px 0 #dfdfdf' : '0')};

  @media (width <= 750px) {
    height: ${(props: TitleCardPanelProps) => (props.isSingle ? '58px' : '40px')};
    padding-left: ${(props: TitleCardPanelProps) => (props.isSingle ? '20px' : '0')};
  }

  .title__card__content {
    color: #000;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: ${(props: TitleCardPanelProps) => (props.isSingle ? '0px' : '12px')};

    @media (width <= 750px) {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }
`
