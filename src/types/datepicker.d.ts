/**
 * We use Ant design's date picker component, but it's use moment.js as default,
 * which will has enormous size in bundle.
 * So we use dayjs instead of moment.js, and use dayjs plugin to make it work.
 * This file aims to override the type definition of Ant design's date picker component.
 */

declare module 'antd/lib/date-picker' {
  import type { Dayjs } from 'dayjs'
  import type {
    PickerDateProps,
    PickerProps,
    RangePickerProps as BaseRangePickerProps,
  } from 'antd/lib/date-picker/generatePicker'

  export type DatePickerProps = PickerProps<Dayjs>
  export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>
  export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>
  export type RangePickerProps = BaseRangePickerProps<Dayjs>
  declare const DatePicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
    PickerProps<Dayjs> & {
      status?: '' | 'warning' | 'error' | undefined
      dropdownClassName?: string | undefined
      popupClassName?: string | undefined
    },
    unknown
  > & {
    WeekPicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      Omit<
        PickerProps<Dayjs> & {
          status?: '' | 'warning' | 'error' | undefined
          dropdownClassName?: string | undefined
          popupClassName?: string | undefined
        },
        'picker'
      >,
      unknown
    >
    MonthPicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      Omit<
        PickerProps<Dayjs> & {
          status?: '' | 'warning' | 'error' | undefined
          dropdownClassName?: string | undefined
          popupClassName?: string | undefined
        },
        'picker'
      >,
      unknown
    >
    YearPicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      Omit<
        PickerProps<Dayjs> & {
          status?: '' | 'warning' | 'error' | undefined
          dropdownClassName?: string | undefined
          popupClassName?: string | undefined
        },
        'picker'
      >,
      unknown
    >
    RangePicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      BaseRangePickerProps<Dayjs> & {
        dropdownClassName?: string | undefined
        popupClassName?: string | undefined
      },
      unknown
    >
    TimePicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      Omit<
        Omit<
          import('rc-picker/lib/Picker').PickerTimeProps<Dayjs>,
          'locale' | 'generateConfig' | 'hideHeader' | 'components'
        > & {
          locale?: import('./generatePicker').PickerLocale | undefined
          size?: import('../button').ButtonSize
          placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined
          bordered?: boolean | undefined
          status?: '' | 'warning' | 'error' | undefined
        } & {
          status?: '' | 'warning' | 'error' | undefined
          dropdownClassName?: string | undefined
          popupClassName?: string | undefined
        },
        'picker'
      >,
      unknown
    >
    QuarterPicker: import('antd/lib/date-picker/generatePicker/interface').PickerComponentClass<
      Omit<
        Omit<
          import('rc-picker/lib/Picker').PickerTimeProps<Dayjs>,
          'locale' | 'generateConfig' | 'hideHeader' | 'components'
        > & {
          locale?: import('./generatePicker').PickerLocale | undefined
          size?: import('../button').ButtonSize
          placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined
          bordered?: boolean | undefined
          status?: '' | 'warning' | 'error' | undefined
        } & {
          status?: '' | 'warning' | 'error' | undefined
          dropdownClassName?: string | undefined
          popupClassName?: string | undefined
        },
        'picker'
      >,
      unknown
    >
  }
  export default DatePicker
}
