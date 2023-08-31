import styled from 'styled-components'

export const MobileMenusPanel = styled.div`
  width: 100%;
  background: #1c1c1c;
  display: flex;
  flex-direction: column;
  position: fixed;
  position: -webkit-fixed;
  z-index: 2;
  color: white;
  top: var(--navbar-height);
  bottom: 0;
  overflow: hidden;
`
