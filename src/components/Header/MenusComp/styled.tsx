import styled from 'styled-components'
import { Link } from '../../Link'

export const MobileMenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 56px;
`

export const MobileMenuOuterLink = styled.a`
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: regular;
  margin-top: 22px;
  height: 21px;
  gap: 8px;

  &:hover {
    font-weight: medium;
    color: ${props => props.theme.primary};

    svg {
      filter: drop-shadow(0 0 4px var(--primary-color));
      mix-blend-mode: difference;
    }
  }
`

export const MobileMenuInnerLink = styled(Link)`
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: regular;
  margin-top: 22px;
  height: 21px;
  gap: 8px;

  &:hover {
    font-weight: medium;
    color: ${props => props.theme.primary};

    svg {
      filter: drop-shadow(0 0 4px var(--primary-color));
      mix-blend-mode: difference;
    }
  }
`

export const HeaderMenuPanel = styled.div`
  display: flex;
  align-items: center;
`
