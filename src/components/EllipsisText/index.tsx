import React from 'react'
import styled from 'styled-components'
import { useTimeout } from '../../utils/hook'

const EllipsisPanel = styled.div`
  display: flex;

  #first {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50%;
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  }

  #second {
    direction: rtl;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50%;
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  }
`

export default ({ text }: { text: string }) => {
  useTimeout(() => {
    const secondElement = document.getElementById('second')
    if (secondElement && secondElement.offsetWidth < secondElement.scrollWidth) {
      secondElement.title = secondElement.innerText
      console.log(secondElement.innerHTML)
    }
  }, 3000)

  return (
    <EllipsisPanel>
      <div id="first">{text.substring(0, text.length / 2)}</div>
      <div id="second">{text.substring(text.length / 2)}</div>
    </EllipsisPanel>
  )
}
