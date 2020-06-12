import styled from 'styled-components'

export const TitleCardPanel = styled.div`
  width: 100%;
  background-color: #ffffff;
  height: ${(props: { isSingle?: boolean }) => (props.isSingle ? '58px' : '50px')};
  padding-left: ${(props: { isSingle?: boolean }) => (props.isSingle ? '40px' : '0')};
  display: flex;
  flex-direction: column;
  justify-content: ${(props: { isSingle?: boolean }) => (props.isSingle ? 'center' : 'flex-start')};
  border-radius: ${(props: { isSingle?: boolean }) => (props.isSingle ? '6px 6px 0 0' : '0')};
  box-shadow: ${(props: { isSingle?: boolean }) => (props.isSingle ? '2px 2px 6px 0 #dfdfdf' : '0')};

  @media (max-width: 750px) {
    height: ${(props: { isSingle?: boolean }) => (props.isSingle ? '58px' : '40px')};
    padding-left: ${(props: { isSingle?: boolean }) => (props.isSingle ? '20px' : '0')};
  }

  .title__card__content {
    color: #000000;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: ${(props: { isSingle?: boolean }) => (props.isSingle ? '0px' : '12px')};

    @media (max-width: 750px) {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }
`
