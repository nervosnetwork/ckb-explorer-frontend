import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import BigNumber from 'bignumber.js'
import Content from '../../components/Content'
import { isMobile } from '../../utils/screen'
import getStatisticsChart from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { parseInterval, handleAxis } from '../../utils/chart'

const ChartPanel = styled.div`
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 700px) {
    margin: 0 4% 30px 4%;
  }
`

const ChartTitle = styled.div`
  color: #66666;
  background: white;
  margin: 30px 10% 0 10%;
  padding-top: 10px;
  font-size: 24px;
  text-align: center;

  @media (max-width: 700px) {
    margin: 20px 4% 0 4%;
    font-size: 16px;
  }
`

const LoadingPanel = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
  align-items: center;
  justify-content: center;

  > img {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 700px) {
      width: 50px;
      height: 50px;
    }
  }
`

const uncleRateScale = () => {
  return {
    uncleRate: {
      min: 0,
      alias: i18n.t('block.uncle_rate'),
    },
  }
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticsChartData, statisticsUncleRates } = useContext(AppContext)

  let min = 0
  let max = 0
  if (statisticsChartData && statisticsChartData.length > 0) {
    min = statisticsChartData[0].blockNumber
    max = statisticsChartData[statisticsChartData.length - 1].blockNumber
  }

  const scale = () => {
    return {
      difficulty: {
        min: 0,
        alias: i18n.t('block.difficulty'),
      },
      hashRate: {
        min: 0,
        alias: i18n.t('block.hash_rate_hps'),
      },
      epochNumber: {
        min: 0,
        alias: i18n.t('block.epoch_number'),
      },
      blockNumber: {
        min,
        max,
        alias: i18n.t('block.block_number'),
        tickInterval: parseInterval(max, min),
      },
    }
  }

  useEffect(() => {
    getStatisticsChart(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{`${i18n.t('block.difficulty')} & ${i18n.t('block.hash_rate')}`}</ChartTitle>
      {statisticsChartData.length > 0 ? (
        <ChartPanel>
          <Chart
            height={window.innerHeight * 0.7}
            scale={scale()}
            forceFit
            data={statisticsChartData}
            padding={isMobile() ? [40, 45, 80, 45] : [40, 80, 120, 80]}
          >
            <Legend
              custom
              allowAllCanceled
              clickable={false}
              textStyle={{
                fontSize: '15',
                fontWeight: 'bold',
                fill: '#666666',
              }}
              items={[
                {
                  value: i18n.t('block.difficulty'),
                  fill: '#3182bd',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#3182bd',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
                {
                  value: i18n.t('block.hash_rate_hps'),
                  fill: '#66CC99',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#66CC99',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
              ]}
            />
            <Axis
              name="blockNumber"
              title={!isMobile()}
              label={{
                formatter: (text: string) => {
                  return handleAxis(new BigNumber(text))
                },
              }}
            />
            <Axis
              name="difficulty"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#3182bd',
                  fontWeight: 'bold',
                },
                formatter: (text: string) => {
                  return handleAxis(new BigNumber(text))
                },
              }}
            />
            <Axis
              name="hashRate"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
                formatter: (text: string) => {
                  return handleAxis(new BigNumber(text))
                },
              }}
            />
            <Axis name="epochNumber" visible={false} />
            <Tooltip />
            <Geom type="line" position="blockNumber*difficulty" color={['type', ['#3182bd']]} size={1} shape="hv" />
            <Geom type="line" position="blockNumber*hashRate" color={['type', ['#66CC99']]} size={1} shape="line" />
            <Geom position="blockNumber*epochNumber" color={['type', ['#3182bd']]} size={0} />
          </Chart>
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <Loading show />
        </LoadingPanel>
      )}

      <ChartTitle>{`${i18n.t('block.uncle_rate')}`}</ChartTitle>
      {statisticsUncleRates.length > 0 ? (
        <ChartPanel>
          <Chart
            height={window.innerHeight * 0.7}
            scale={uncleRateScale()}
            forceFit
            data={statisticsUncleRates}
            padding={isMobile() ? [40, 45, 80, 45] : [40, 80, 80, 80]}
          >
            <Legend
              custom
              allowAllCanceled
              clickable={false}
              textStyle={{
                fontSize: '15',
                fontWeight: 'bold',
                fill: '#666666',
              }}
              items={[
                {
                  value: i18n.t('block.uncle_rate'),
                  fill: '#66CC99',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#66CC99',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
              ]}
            />
            <Axis
              name="uncleRate"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
                formatter: (text: string) => {
                  return `${new BigNumber(text).multipliedBy(100).toString()}%`
                },
              }}
            />
            <Tooltip />
            <Geom type="line" position="epochNumber*uncleRate" color="#66CC99" size={1} shape="line" />
          </Chart>
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <Loading show />
        </LoadingPanel>
      )}
    </Content>
  )
}
