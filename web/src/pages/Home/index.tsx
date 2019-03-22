import React from 'react'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

export default () => {
  return (
    <Page>
      <Header search={false}/>
      <Content
        style={{
          padding: 20,
        }}
      >
        {new Array(100).fill(1).map(() => {
          const d = Math.random()
          return <p key={d}>{d}</p>
        })}
      </Content>
      <Footer />
    </Page>
  )
}
