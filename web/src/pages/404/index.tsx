import React from 'react'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

export default () => {
  return (
    <Page>
      <Header />
      <Content
        style={{
          padding: 20,
        }}
      >
        <div className="container">404</div>
      </Content>
      <Footer />
    </Page>
  )
}
