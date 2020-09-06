import React from 'react'
import Scrollspy from 'react-scrollspy'
import { createUseStyles } from 'react-jss'
import { Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
    textAlign: 'justify',
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
    borderLeft: '5px solid #FF625E',
    '& a': {
      color: '#f83541 !important',
    },
  },
  innerWrapper: {
    ...theme.font,
  },
}))

const Disclaimer = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <Row>
          <Col xs={4}>
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
                    ]} currentClassName={classes.currentLink}>
                      <li><a href="#section-1">1. WEBSITE DISCLAIMER</a></li>
                      <li><a href="#section-2">2. EXTERNAL LINKS DISCLAIMER</a></li>
                      <li><a href="#section-3">3. PROFESSIONAL DISCLAIMER</a></li>
                      <li><a href="#section-4">4. AFFILIATES DISCLAIMER</a></li>
                      <li><a href="#section-5">5. TESTIMONIALS DISCLAIMER</a></li>
                    </Scrollspy>
                  </div>
                </div>
              )}
              
            </Sticky>
          </Col>
          <Col xs={8}>
            <div className={classes.innerWrapper}>
              <section id="section-1">
                <div className={classes.hero}>
                  <div >
                    <h2>WEBSITE DISCLAIMER</h2>
                  </div>
                  <div >
                    <p>
                      The information provided by D.Buzz (“we,” “us” or “our”) on <a href="https://d.buzz">https://d.buzz</a> (the “Site”) and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site or our mobile application. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-2">
                <div className={classes.hero}>
                  <div >
                    <h2>EXTERNAL LINKS DISCLAIMER</h2>
                  </div>
                  <div >
                    <p>
                      The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-3">
                <div className={classes.hero}>
                  <div >
                    <h2>PROFESSIONAL DISCLAIMER</h2>
                  </div>
                  <div >
                    <p>
                      The Site cannot and does not contain cryptocurrency advice. The cryptocurrency information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of cryptocurrency advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE OR OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-4">
                <div className={classes.hero}>
                  <div >
                    <h2>AFFILIATES DISCLAIMER</h2>
                  </div>
                  <div >
                    <p>
                    You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-5">
                <div className={classes.hero}>
                  <div >
                    <h2>TESTIMONIALS DISCLAIMER</h2>
                  </div>
                  <div style={{paddingBottom: 300}}>
                    <p>
                      The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY. 
                    </p>
                    <p>
                      The testimonials on the Site are submitted in various forms such as text, audio and/or video, and are reviewed by us before being posted. They are eddited to fit the size and lenght we have space for.
                    </p>
                    <p>
                      The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions. We are not affiliated with users who provide testimonials, and users are not paid or otherwise compensated for their testimonials.
                    </p>
                    <p>
                      The testimonials on the Site are not intended, nor should they be construed, as claims that our products and/or services can be used to diagnose, treat, mitigate, cure, prevent or otherwise be used for any disease or medical condition. No testimonials have been clinically proven or evaluated.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default Disclaimer