import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import CloseIcon from '../../assets/modal_close.png'
import HelpIcon from '../../assets/qa_help.png'
import AlertIcon from '../../assets/alert.png'
import { LabeledInput } from './LabeledInput'
import styles from './styles.module.scss'
import { ImgUpload } from './ImgUpload'
import CommonButton from '../CommonButton'
import CommonModal from '../CommonModal'
import CommonSelect from '../CommonSelect'
import { isMainnet } from '../../utils/chain'
import { scripts } from '../../pages/ScriptList'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'
import { isValidNoNegativeInteger } from '../../utils/number'
import { useSetToast } from '../Toast'
import { explorerService } from '../../services/ExplorerService'
import {
  REPORT_EMAIL_ADDRESS,
  REPORT_EMAIL_SUBJECT,
  REPORT_EMAIL_BODY_EN,
  REPORT_EMAIL_BODY_ZH,
} from '../../constants/common'
import Tooltip from '../Tooltip'

const emptyTokenInfo = {
  tokenType: '',
  typeHash: '',
  symbol: '',
  name: '',
  decimal: '',
  description: '',
  website: '',
  creatorEmail: '',
  logo: '',
}

export type TokenInfo = typeof emptyTokenInfo

const LabelTooltip = ({ title, icon }: { title: string; icon?: string }) => (
  <Tooltip trigger={<img src={icon ?? HelpIcon} alt="tooltip" className={styles.tooltipIcon} />} placement="bottom">
    {title}
  </Tooltip>
)

const useCountdown = () => {
  const [target, setTarget] = useState<number | null>(null)
  const [seconds, setSeconds] = useState(0)
  const timer = useRef<NodeJS.Timer | null>(null)
  const isCounting = target !== null

  useEffect(() => {
    if (!target) return

    timer.current = setInterval(() => {
      setSeconds(Math.ceil((target - Date.now()) / 1000))
    }, 1000)
    setSeconds(Math.ceil((target - Date.now()) / 1000))
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [target])

  useEffect(() => {
    if (seconds <= 0) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      setSeconds(0)
      setTarget(null)
    }
  }, [seconds])

  const start = (remain: number) => {
    if (timer.current) {
      clearInterval(timer.current)
    }
    setTarget(Date.now() + remain * 1000)
  }

  const clear = () => {
    if (timer.current) {
      clearInterval(timer.current)
    }
    setTarget(null)
  }

  return {
    isCounting,
    seconds,
    start,
    clear,
  }
}

export const SubmitTokenInfo = ({
  onClose,
  initialInfo,
  onSuccess,
  tagFilters = ['xudt', 'sudt'],
}: {
  onClose: () => void
  initialInfo?: TokenInfo
  onSuccess?: Function
  tagFilters?: ('sudt' | 'xudt')[]
}) => {
  const [t, { language }] = useTranslation()
  const history = useHistory()
  const setToast = useSetToast()
  const [submitting, setSubmitting] = useState(false)
  const countdown = useCountdown()

  const isModification = !!initialInfo

  const scriptDataList = isMainnet() ? MainnetContractHashTags : TestnetContractHashTags
  const tokenTypeOptions = scriptDataList
    .filter(scriptData => tagFilters.includes(scriptData.tag.toLowerCase() as 'sudt' | 'xudt'))
    .sort((a, b) => a.tag.localeCompare(b.tag))
    .map(scriptData => ({
      label: scripts.get(scriptData.tag)?.name ?? scriptData.tag,
      value: scriptData.tag.toLowerCase(),
    }))

  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(
    initialInfo ?? { ...emptyTokenInfo, tokenType: tokenTypeOptions[0].value },
  )

  const isXudtSelected = tokenInfo.tokenType === 'xudt'

  const [vericode, setVericode] = useState('')

  const handleTokenTypesChange = (value: string) => {
    setTokenInfo(info => ({ ...info, tokenType: value }))
  }

  const handleFieldChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { name, value } = e.currentTarget
    setTokenInfo(info => ({ ...info, [name]: value }))
  }

  const handleVericodeChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setVericode(e.currentTarget.value)
  }

  const handleGetCodeClick = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (countdown.isCounting) {
      return
    }
    try {
      countdown.start(60)
      const res = await explorerService.api.getVericodeForTokenInfo(tokenInfo.typeHash)
      if (res.status === 200) {
        return
      }
      throw new Error('Fail to get code')
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400) {
          const code = e.response?.data[0]?.code
          setToast({
            message: code ? t(`error.codes.${code}`) : e.response?.data[0]?.title,
          })
        } else {
          setToast({ message: e.message })
        }
      }
      countdown.clear()
    }
  }

  useEffect(() => {
    // scroll to top when open modal
    window.scrollTo(0, 0)
  }, [])

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      let baseString: string | null = null
      // eslint-disable-next-line func-names
      reader.onloadend = function () {
        baseString = reader.result as string
        setTokenInfo(info => ({ ...info, logo: baseString ?? info.logo }))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearForm = () => {
    onClose()
    setTokenInfo(emptyTokenInfo)
  }

  const handleClose = () => {
    clearForm()
    onClose()
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  const validateEmail = (email: string) => emailRegex.test(email)
  const isEmailValid = validateEmail(tokenInfo.creatorEmail)

  const typeHashRegex = /^0x[0-9A-Fa-f]{64}$/ // 0x + 32 bytes
  const validateTypeHash = (str: string) => typeHashRegex.test(str)
  const isTypeHashValid = validateTypeHash(tokenInfo.typeHash)

  const websiteRegex =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
  const validateWebsite = (str: string) => websiteRegex.test(str)
  const isInputWebsiteValid = validateWebsite(tokenInfo.website)

  const isInputDecimalValid = isValidNoNegativeInteger(tokenInfo.decimal)

  const generalCondition =
    !!tokenInfo.tokenType &&
    !!tokenInfo.typeHash &&
    isTypeHashValid &&
    !!tokenInfo.website &&
    isInputWebsiteValid &&
    (isModification ? !!vericode : !!tokenInfo.creatorEmail && isEmailValid)

  const conditions = {
    xudt: generalCondition,
    sudt: generalCondition && !!tokenInfo.symbol && !!tokenInfo.decimal && isInputDecimalValid,
  }

  const isSubmitable = isXudtSelected ? conditions.xudt : conditions.sudt

  const handleConfirm = async () => {
    if (!isSubmitable) {
      return
    }

    setSubmitting(true)

    const commonInfo = {
      symbol: tokenInfo.symbol,
      email: tokenInfo.creatorEmail,
      description: tokenInfo.description,
      operator_website: tokenInfo.website,
      decimal: Number(tokenInfo.decimal),
      full_name: tokenInfo.name,
      total_amount: 0,
      icon_file: tokenInfo.logo ?? '',
    }

    const extraInfo = isModification
      ? {
          token: vericode,
        }
      : {}

    const id = tokenInfo.typeHash.toLowerCase()

    explorerService.api
      .submitTokenInfo(id, { ...commonInfo, ...extraInfo })
      .then(() => {
        handleClose()
        if (!isModification) {
          history.push(`/${language}/${isXudtSelected ? 'xudt' : 'sudt'}/${id}`)
        }
        if (onSuccess) {
          onSuccess()
        }
      })
      .catch(e => {
        if (e instanceof AxiosError) {
          const code = e.response?.data[0]?.code
          setToast({
            message: code ? t(`error.codes.${code}`) : e.response?.data[0]?.title,
          })
        } else {
          setToast({ message: t('error.page_crashed_tip') })
        }
        setSubmitting(false)
      })
  }

  return (
    <CommonModal isOpen onClose={handleClose}>
      <div className={styles.modalWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.modalTitle}>
            <div className={styles.title}>{t(isModification ? 'udt.modify_token_info' : 'udt.submit_token_info')}</div>
            <button type="button" onClick={handleClose} className={styles.closeBtn}>
              <img src={CloseIcon} alt="close icon" />
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.modalContent}>
            <div className={styles.sectionTitle}>{t('submit_token_info.token_type_scripts')}</div>
            {isModification ? null : (
              <div className={styles.section}>
                <LabeledInput
                  name="tokenType"
                  isRequired
                  labelRightAddon={<LabelTooltip title={t('submit_token_info.token_type_tip')} />}
                  label={t('submit_token_info.token_type')}
                  className={styles.labeledInput}
                >
                  <CommonSelect
                    className={styles.codeHashSelect}
                    options={tokenTypeOptions}
                    onChange={handleTokenTypesChange}
                    defaultValue={tokenTypeOptions[0].value}
                  />
                </LabeledInput>

                <LabeledInput
                  isRequired
                  isError={!!tokenInfo.typeHash && !isTypeHashValid}
                  value={tokenInfo.typeHash}
                  name="typeHash"
                  onChange={handleFieldChange}
                  labelRightAddon={<LabelTooltip title={t('submit_token_info.type_hash_tip')} />}
                  label={t('submit_token_info.type_hash')}
                  placeholder={t('submit_token_info.type_hash_placeholder')}
                  className={styles.labeledInput}
                />
              </div>
            )}
            <div className={styles.section}>
              <LabeledInput
                isRequired
                value={tokenInfo.symbol}
                name="symbol"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.symbol_tip')} />}
                label={t('submit_token_info.symbol')}
                placeholder={t('submit_token_info.symbol_placeholder')}
                className={styles.labeledInput}
                data-is-visible={!isXudtSelected}
              />
              <LabeledInput
                value={tokenInfo.name}
                name="name"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.name_tip')} />}
                label={t('submit_token_info.name')}
                placeholder={t('submit_token_info.name_placeholder')}
                className={styles.labeledInput}
                data-is-visible={!isXudtSelected}
              />
              <LabeledInput
                isRequired
                isError={!!tokenInfo.decimal && !isInputDecimalValid}
                value={tokenInfo.decimal}
                name="decimal"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.decimal_tip')} />}
                label={t('submit_token_info.decimal')}
                placeholder={t('submit_token_info.decimal_placeholder')}
                className={styles.labeledInput}
                data-is-visible={!isXudtSelected}
              />
              <LabeledInput
                value={tokenInfo.description}
                name="description"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.description_tip')} />}
                label={t('submit_token_info.description')}
                placeholder={t('submit_token_info.description_placeholder')}
                className={styles.labeledInput}
              />
              <LabeledInput
                isRequired
                isError={!!tokenInfo.website && !isInputWebsiteValid}
                value={tokenInfo.website}
                name="website"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.website_tip')} />}
                label={t('submit_token_info.website')}
                placeholder={t('submit_token_info.website_placeholder')}
                className={styles.labeledInput}
              />
              <LabeledInput
                isRequired
                disabled={isModification}
                isError={!isModification && !!tokenInfo.creatorEmail && !isEmailValid}
                value={tokenInfo.creatorEmail}
                name="creatorEmail"
                onChange={handleFieldChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.creator_email_tip')} icon={AlertIcon} />}
                label={t('submit_token_info.creator_email')}
                placeholder={t('submit_token_info.creator_email_placeholder')}
                className={styles.labeledInput}
              />
              <ImgUpload
                value={tokenInfo.logo}
                onClear={() => setTokenInfo(info => ({ ...info, logo: '' }))}
                onChange={handleImgChange}
                labelRightAddon={<LabelTooltip title={t('submit_token_info.logo_tip')} />}
                label={t('submit_token_info.logo')}
                placeholder={t('submit_token_info.logo_placeholder')}
                className={styles.labeledInput}
              />
            </div>
            {initialInfo ? (
              <div>
                <div className={styles.report}>
                  {t('udt.email_vericode')}

                  <Tooltip
                    trigger={
                      <a
                        href={`mailto:${REPORT_EMAIL_ADDRESS}?subject=${REPORT_EMAIL_SUBJECT}&body=${
                          language === 'zh' ? REPORT_EMAIL_BODY_ZH : REPORT_EMAIL_BODY_EN
                        }`}
                      >
                        {t('udt.report')}
                      </a>
                    }
                    placement="top"
                  >
                    {t('udt.wrong_email')}
                  </Tooltip>
                </div>
                <div className={styles.vericodeEmail}>{initialInfo.creatorEmail}</div>
                <div className={styles.vericode}>
                  <input value={vericode} onChange={handleVericodeChange} placeholder={t('udt.vericode')} />
                  <button type="button" onClick={handleGetCodeClick} disabled={countdown.isCounting}>
                    {countdown.isCounting ? `${countdown.seconds}s` : t('udt.get_code')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.modalFooter}>
            <CommonButton
              loading={submitting}
              className={styles.submitBtn}
              onClick={handleConfirm}
              name={t('submit_token_info.confirm')}
              disabled={!isSubmitable}
            />
          </div>
        </div>
      </div>
    </CommonModal>
  )
}
