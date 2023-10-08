import styled from 'styled-components'

export const CellbasePanel = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  position: relative;
  width: 100%;
  margin-top: ${(props: { isDetail?: boolean }) => (props.isDetail ? '0px' : '16px')};

  @media (max-width: 750px) {
    margin-top: 10px;
    height: 16px;
  }

  .cellbaseContent {
    color: #000;
  }

  a {
    font-weight: 500;
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  .cellbaseHelp {
    margin-left: 10px;
    transform: translateY(2px);

    &:focus {
      outline: 0;
    }
  }

  .cellbaseHelpIcon {
    width: 16px;
    height: 16px;
    margin: 2px 8px 0;
  }
`
