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
  title: {
    paddingTop: 50,
    textAlign: 'center',
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
          <h3 className={classes.title}>Understanding Key Concepts in Digital Currency and Web Technology</h3>
          <StickyContainer>
            <Row>
              <Col xs={5} className="d-none d-md-block">
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
                          'section-9',
                        ]} currentClassName={classes.currentLink}>
                          <li><HashLink to="#section-1">What is Cryptocurrency?</HashLink></li>
                          <li><HashLink to="#section-2">What is Bitcoin?</HashLink></li>
                          <li><HashLink to="#section-3">What is HIVE?</HashLink></li>
                          <li><HashLink to="#section-4">What is Decentralization?</HashLink></li>
                          <li><HashLink to="#section-5">What is Blockchain Technology?</HashLink></li>
                          <li><HashLink to="#section-6">What is DBuzz?</HashLink></li>
                          <li><HashLink to="#section-7">What is Web3?</HashLink></li>
                          <li><HashLink to="#section-8">Do DBuzz posts include a title section?</HashLink></li>
                          <li><HashLink to="#section-9">TALKING POINTS :</HashLink></li>
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
                        <h3>What is Cryptocurrency?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                        Cryptocurrency refers to digital or virtual money, created and managed through advanced cryptography and open-source software. It operates independently of a central authority, offering a new way of financial transactions.
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
                        Bitcoin, the first-ever cryptocurrency, is a digital currency used for secure and instant transfer of value anywhere in the world. It's recognized for its pioneering role in the field of cryptocurrencies.
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
                        HIVE is a versatile cryptocurrency designed to support decentralized applications. It's widely used in developing social media platforms and NFT-based games, promoting a new era of digital interaction and gaming.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-4">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is Decentralization?</h3>
                      </div>
                      <hr />
                      <div >
                        <p>
                        Decentralization refers to the distribution of control and decision-making across multiple entities or individuals, rather than being centralized in a single authority. This approach promotes greater transparency and inclusivity in systems and processes.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-5">
                    <div className={classes.hero}>
                      <div >
                        <h3>What is Blockchain Technology?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          Blockchain technology is a revolutionary system of recording information in a way that makes it nearly impossible to change or hack. It's a digital ledger of transactions that is duplicated and distributed across the entire network of computer systems.
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
                        DBuzz is a decentralized social media platform, leveraging the Hive blockchain. It offers a new way of social interaction, free from central control, emphasizing user-generated content and community governance.
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
                        Web3 represents the third generation of internet services. Unlike Web1, focused on reading, and Web2, on interaction (reading & writing), Web3 incorporates ownership elements (like in D.Buzz, Splinterlands), giving users a stake in the digital landscape.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-8">
                    <div className={classes.hero}>
                      <div >
                        <h3>Do DBuzz posts include a title section?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                        The first 82 characters of each Buzz are used to form a title section at the blockchain level to display properly on front-ends that use titles (PeakD.com, Ecency.com, etc.).
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-9">
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