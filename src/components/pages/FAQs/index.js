import React from 'react'
import Scrollspy from 'react-scrollspy'
import { HashLink } from 'react-router-hash-link'
import { createUseStyles } from 'react-jss'
import { Sticky, StickyContainer } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from '@material-ui/core'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    paddintTop: 400,
    display: 'block',
    '& h2': {
      fontFamily: 'Segoe-Bold',
      fontSize: 18, 
    },
    '& p': {
      fontSize: 14, 
    },
    '& i': {
      fontSize: 14,
    },
  },
  hero: {
    paddingTop: 100,
    textAlign: 'left',
  },
  outsideWrapper: {
    paddingTop: 50,
    ...theme.font,
  },
  sideWrapper: {
    width: '100%', 
    paddingTop: 100, 
    maxHeight: 700, 
    overflow: 'auto',
    '& li': {
      listStyleType: 'none',
      paddingBottom: 5,
    },
    '& a': {
      ...theme.font,
      fontFamily: 'Segoe-Bold',
      fontSize: 14,
      textDecoration: 'none',
      paddingLeft: 10, 
    },
  },
  currentLink: {
    borderLeft: '3px solid #FF625E',
    '& a': {
      color: '#f83541 !important',
    },
  },
  innerWrapper: {
    ...theme.font,
  },
}))

const FAQs = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Container maxWidth="md" fluid>
        <div className={classes.wrapper}>
          <StickyContainer>
            <Row>
              <Col xs={8} className="d-none d-md-block">
                <Sticky>
                  {({ style }) => (
                    <div style={{...style}}>
                      <div className={classes.sideWrapper}>
                        <Scrollspy items={[
                          'section-1', 
                          'section-2', 
                          'section-3', 
                          'section-4', 
                          'section-5',
                          'section-6',
                          'section-7',
                          'section-8',
                        ]} currentClassName={classes.currentLink}>
                          <li><HashLink to="#section-1">What is crypto currency?</HashLink></li>
                          <li><HashLink to="#section-2">What is Bitcoin?</HashLink></li>
                          <li><HashLink to="#section-3">What is HIVE?</HashLink></li>
                          <li><HashLink to="#section-4">What is decentralization?</HashLink></li>
                          <li><HashLink to="#section-5">What is blockchain technology?</HashLink></li>
                          <li><HashLink to="#section-6">What is DBuzz?</HashLink></li>
                          <li><HashLink to="#section-7">What is Web3?</HashLink></li>
                          <li><HashLink to="#section-8">TALKING POINTS :</HashLink></li>
                        </Scrollspy>
                      </div>
                    </div>
                  )}
                  
                </Sticky>
              </Col>
              <Col>
                <div className={classes.innerWrapper}>
                  <section id="section-1">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is crypto currency?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                          Among other things, crypto currency is digital money built with open source software.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-2">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is Bitcoin?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                          Bitcoin is a crypto currency used to transfer money.
                        </p>
                        <p>
                          Bitcoin also holds the record as the first crypto currency ever created.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-3">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is HIVE?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                          HIVE is a crypto currency used to build decentralized applications, including social media platforms and NFT games.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-4">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is decentralization?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                          Decentralization is a system or process that's controlled by a number of people, not just a centralized authority.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-5">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is blockchain technology?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          A chain of records that's generally impossible to erase.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-6">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is DBuzz?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          DBuzz is a decentralized social media platform built on the Hive blockchain.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-7">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is Web3?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          Web1 is about reading, Web2 is about reading & writing (liking, commenting, etc) and Web3 is about reading, writing & owning (D.Buzz, Splinterlands, etc) a piece of the Internet.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-8">
                    <div className={classes.hero}>
                      <div >
                        <h3>TALKING POINTS :</h3>
                      </div>
                      <hr />
                      <div style={{paddingBottom: 300}}>
                        <p>
                          DBuzz offers Internet users access to Web3 social media, account ownership, and organic information.
                        </p>
                        <p>
                          On DBuzz, you will discover real people and natural conversations, instead of the rigged algorithms typically found on Web2.
                        </p>
                        <p>
                          Lastly, DBuzz serves the public, not advertisements.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                </div>
              </Col>
            </Row>
          </StickyContainer>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default FAQs