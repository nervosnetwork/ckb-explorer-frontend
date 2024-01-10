import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const TagPanel = styled.div`
  height: 20px;
  border-radius: 4px;
  border: solid 0.5px ${({ isLock }: { isLock?: boolean }) => (isLock ? '#b1caff' : '#caacef')};
  background-color: ${({ isLock }: { isLock?: boolean }) => (isLock ? '#d8e4ff' : '#f0e0fb')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 8px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    height: 16px;
  }
`
