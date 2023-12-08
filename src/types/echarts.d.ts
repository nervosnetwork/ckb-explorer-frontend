declare namespace echarts {
  // this type is provided by echarts since v5.0.0, but now that we use v4 so we need to define it by ourselves, copied from:
  // https://github.com/apache/echarts/blob/babe688f40feefe3b3f53b31e0d227256fcb36ce/src/util/types.ts#L678-L707
  export type CallbackDataParams = {
    // component main type
    componentType: string
    // component sub type
    componentSubType: string
    componentIndex: number
    // series component sub type
    seriesType?: string
    // series component index (the alias of `componentIndex` for series)
    seriesIndex?: number
    seriesId?: string
    seriesName?: string
    name: string
    dataIndex: number
    data: OptionDataItem
    dataType?: SeriesDataType
    value: OptionDataItem | OptionDataValue
    color?: ZRColor
    opacity?: number
    borderColor?: string
    dimensionNames?: DimensionName[]
    encode?: DimensionUserOutputEncode
    marker?: TooltipMarker
    status?: DisplayState
    dimensionIndex?: number
    percent?: number // Only for chart like 'pie'
  }
}
