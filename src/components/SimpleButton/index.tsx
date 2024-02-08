import { MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'

const ButtonPanel = styled.div`
  cursor: pointer;
`

export default ({
  id,
  className,
  title,
  onClick,
  onMouseOver,
  children,
}: {
  id?: string
  className?: string
  title?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onMouseOver?: MouseEventHandler<HTMLDivElement>
  children: ReactNode | string
}) => (
  <ButtonPanel
    id={id}
    className={className}
    title={title}
    role="button"
    tabIndex={-1}
    onKeyDown={() => {}}
    onMouseOver={event => {
      if (onMouseOver) {
        onMouseOver(event)
      }
    }}
    onClick={event => {
      if (onClick) {
        onClick(event)
      }
    }}
  >
    {children}
  </ButtonPanel>
)
