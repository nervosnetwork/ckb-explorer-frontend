import React from 'react'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

export default () => {
  return (
    <Page>
      <Header search={false} />
      <Content>
        <div
          style={{
            height: (670 * window.innerWidth) / 1920,
            backgroundColor: 'rgb(24 50 93)',
          }}
        />
        <div
          className="container"
          style={{
            padding: 20,
            border: '1px  dashed black',
          }}
        >
          {new Array(100).fill(1).map(() => {
            const d = Math.random()
            return <p key={d}>{d}</p>
          })}
        </div>
      </Content>
      <Footer />
    </Page>
  )
}
