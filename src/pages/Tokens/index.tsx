import React, { useEffect } from 'react'
import Content from '../../components/Content'
import {
  TokensPanel,
  TokensTableTitle,
  TokensTableContent,
  TokensTableItem,
  TokensContentEmpty,
  TokensLoadingPanel,
} from './styled'
import HelpIcon from '../../assets/qa_help.png'
import { SUDT_EMAIL_SUBJECT, SUDT_EMAIL_BODY } from '../../utils/const'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { useAppState, useDispatch } from '../../contexts/providers'
import getTokens from '../../service/app/tokens'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { Tooltip } from 'antd'

const TokenItem = ({ token }: { token: State.TokenInfo }) => {
  const name = token.fullName ? token.fullName : i18n.t('udt.unknown_token')
  const symbol = token.symbol ? token.symbol : `#${token.typeHash.substring(token.typeHash.length - 4)}`
  return (
    <TokensTableItem to={`/sudt/${token.typeHash}`}>
      <div className="tokens__item__content">
        <div className="tokens__item__name__panel">
          <img src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
          <div>
            <div className="tokens__item__name">
              <span>{`${name} (${symbol})`}</span>
              {!token.fullName && (
                <Tooltip placement="bottom" title={i18n.t('udt.unknown_token_description')}>
                  <img src={HelpIcon} alt="token icon" />
                </Tooltip>
              )}
            </div>
            {token.description && <div className="tokens__item__description">{token.description}</div>}
          </div>
        </div>
        <div className="tokens__item__transactions">{localeNumberString(token.h24CkbTransactionsCount)}</div>
        <div className="tokens__item__address__count">{localeNumberString(token.addressesCount)}</div>
        <div className="tokens__item__created__time">{parseDateNoTime(Number(token.createdAt) / 1000, false, '-')}</div>
      </div>
      <div className="tokens__item__separate" />
    </TokensTableItem>
  )
}

const TokensTableState = () => {
  const {
    tokensState: { tokens, status },
  } = useAppState()
  switch (status) {
    case 'Error':
      return <TokensContentEmpty>{i18n.t('udt.tokens_empty')}</TokensContentEmpty>
    case 'OK':
      return (
        <TokensTableContent>
          {tokens.map(token => (
            <TokenItem key={token.typeHash} token={token} />
          ))}
        </TokensTableContent>
      )
    case 'InProgress':
    case 'None':
    default:
      return (
        <TokensLoadingPanel>
          <Loading show />
        </TokensLoadingPanel>
      )
  }
}

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    getTokens(dispatch)
  }, [dispatch])

  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokens__title__panel">
          <span>{i18n.t('udt.tokens')}</span>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`mailto:asset-info-submit@nervos.org?subject=${SUDT_EMAIL_SUBJECT}&body=${SUDT_EMAIL_BODY}`}
          >
            {i18n.t('udt.submit_token_info')}
          </a>
        </div>
        <TokensTableTitle>
          <span>{i18n.t('udt.name_symbol')}</span>
          <span>{i18n.t('udt.transactions')}</span>
          <span>{i18n.t('udt.address_count')}</span>
          <span>{i18n.t('udt.created_time')}</span>
        </TokensTableTitle>
        <TokensTableState />
      </TokensPanel>
    </Content>
  )
}
