import { FC, ComponentPropsWithoutRef, ChangeEventHandler, useCallback, KeyboardEventHandler } from 'react'
import { useForkedState } from '../../hooks'
import styles from './SearchInput.module.scss'

const SearchInput: FC<
  ComponentPropsWithoutRef<'input'> & {
    onEnter?: () => void
    loading?: boolean
  }
> = ({ loading, onEnter, value: propsValue, onChange: propsOnChange, onKeyUp: propsOnKeyUp, ...elprops }) => {
  const [value, setValue] = useForkedState(propsValue)

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (loading) {
        return
      }
      setValue(event.target.value)
      propsOnChange?.(event)
    },
    [propsOnChange, setValue, loading],
  )

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
    event => {
      const isEnter = event.key === 'Enter'
      if (isEnter) {
        onEnter?.()
      }
      propsOnKeyUp?.(event)
    },
    [onEnter, propsOnKeyUp],
  )

  return (
    <input
      enterKeyHint="search"
      className={styles.searchInputPanel}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      {...elprops}
    />
  )
}

export default SearchInput
