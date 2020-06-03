import React from 'react'
import Content from '../../components/Content'
import { TokensPanel, TokensTableTitle, TokensTableContent, TokensTableItem } from './styled'
import { SUDT_EMAIL_SUBJECT, SUDT_EMAIL_BODY } from '../../utils/const'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { useAppState } from '../../contexts/providers'

const TokenItem = ({ token }: { token: State.TokenInfo }) => {
  return (
    <TokensTableItem>
      <div className="tokens__item__name__panel">
        <img src={token.iconFile} alt="token icon" />
        <div>
          <div className="tokens__item__name">{`${token.fullName}(${token.symbol})`}</div>
          <div className="tokens__item__description">{token.description}</div>
        </div>
      </div>
      <div className="tokens__item__transactions">{localeNumberString(token.h24CkbTransactionsCount)}</div>
      <div className="tokens__item__address__count">{localeNumberString(token.addressesCount)}</div>
      <div className="tokens__item__created__time">{parseDateNoTime(token.createdAt)}</div>
    </TokensTableItem>
  )
}

export default () => {
  const {
    tokensState: { tokens },
  } = useAppState()
  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokens__title__panel">
          <span>Tokens</span>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`mailto:asset-info-submit@nervos.org?subject=${SUDT_EMAIL_SUBJECT}&body=${SUDT_EMAIL_BODY}`}
          >
            Submit Token Info
          </a>
        </div>
        <TokensTableTitle>
          <span>Name(symbol)</span>
          <span>24hr Transaction</span>
          <span>Address Count</span>
          <span>Created Time</span>
        </TokensTableTitle>
        <TokensTableContent>
          {tokens.map(token => (
            <TokenItem key={token.symbol} token={token} />
          ))}
        </TokensTableContent>
      </TokensPanel>
    </Content>
  )
}
