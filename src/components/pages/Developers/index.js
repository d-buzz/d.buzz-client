import React from 'react'
import { createUseStyles } from 'react-jss'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from '@material-ui/core'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import SyntaxHighlighter from 'react-syntax-highlighter'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    ...theme.font,
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
}))

const Developers = () => {
  const classes = useStyles()
  const hostUrl = window.location.origin
  const webIntentUrl = `${hostUrl}/#/intent/buzz`
  const snippet1 = `<a class="dbuzz-share-button" href="${webIntentUrl}">Buzz</a>`
  const snippet2 = `<a class="dbuzz-share-button" href="${webIntentUrl}?text=Hello%20dbuzz">Buzz</a>`
  const snippet3 = `<a class="dbuzz-share-button" href="${webIntentUrl}" ` +
    'data-text="Hello dbuzz" data-size="large" data-hashtags="dbuzz,hive" data-url="https://d.buzz">Buzz</a>'
  const snippet4 = `<script type="text/javascript" src="${hostUrl}/buzzWidget.js"></script>`

  return (
    <React.Fragment>
      <Container maxWidth="md" fluid>
        <div className={classes.wrapper}>
          <Row>
            <Col>
              <section id="section-1">
                <div className={classes.hero}>
                  <div >
                    <h2>EMBED BUZZ BUTTON</h2>
                    <p>
                      The Buzz button is a small button displayed on your website where viewers can easily share content on DBuzz. It consists of
                      two parts; a link to the d.buzz's Buzz composer and buzzWidget.js script to enhance the link with the easily identifiable Buzz button.
                    </p>
                  </div>
                  <div>
                    <iframe id="dbuzz-widget-0"
                      title="Dbuzz share button"
                      className="dbuzz-share-button"
                      allowtransparency="true"
                      scrolling="no"
                      frameBorder="0"
                      style={{ position: "static", visibility: "visible", width: "60px", height: "20px" }}
                      src={hostUrl + "/widgets/buzz_button.html#id=dbuzz-widget-1&size=m&text=Hello world&url=" + hostUrl + "&tags=dbuzz,hive"}></iframe>
                  </div>
                  <div >
                    <h5>
                      Web Intent Url
                    </h5>
                    <p><a href={webIntentUrl}>{webIntentUrl}</a></p>
                    <h5>
                      How to add a Buzz button in your website?
                    </h5>
                    <ul>
                      <li>
                        <i>Create a new anchor element with a <b>dbuzz-share-button</b> class to allow the buzzWidget.js script to discover the element and turn it into a Buzz Button. Set href attribute value to <a href={webIntentUrl} target="_blank" rel="noopener noreferrer">{webIntentUrl}</a> to create a link that redirects to the DBuzz Web Intent Composer.</i>
                        <SyntaxHighlighter language="markup" style={dracula} wrapLongLines>
                          {snippet1}
                        </SyntaxHighlighter>
                      </li>
                      <br />
                      <li>
                        <i>Set Buzz text by customizing Buzz web intent query parameters.</i>
                        <SyntaxHighlighter language="markup" style={dracula} wrapLongLines>
                          {snippet2}
                        </SyntaxHighlighter>
                      </li>
                      <br />
                      <li>
                        <i>Customize Buzz button parameters using data-* attributes.</i>
                        <SyntaxHighlighter language="markup" style={dracula} wrapLongLines>
                          {snippet3}
                        </SyntaxHighlighter>
                      </li>
                      <br />
                      <li>
                        <i>Include buzzWidget.js script once in your page template to enable tracking of Buzz button widget JavaScript events.</i>
                        <SyntaxHighlighter language="markup" style={dracula} wrapLongLines>
                          {snippet4}
                        </SyntaxHighlighter>
                      </li>
                    </ul>
                    <br />
                    <h5>
                      Buzz web intent query parameters
                    </h5>
                    <br />
                    <ul>
                      <li>
                        <p>The <b>Text</b> parameter appears pre-selected in a Buzz composer. If not set, it may be auto-populated from the webpage's title element.</p>
                      </li>
                      <li>
                        <p>The <b>Url</b> parameter contains an absolute HTTP or HTTPS URL to be shared on DBuzz. If not set,  it may be auto-populated from location.href of the page.</p>
                      </li>
                      <li>
                        <p>The <b>Tags</b> parameter must be separated with a comma.  Omit a preceding "#" from each hashtag; the Buzz composer will automatically  add the proper space-separated hashtag.</p>
                      </li>
                    </ul>
                    <br />
                    <h5>
                      Buzz Button customization
                    </h5>
                    <br />
                    <p>Add a data-size attribute value of "large" to display a larger Buzz button</p>
                    <div style={{ paddingBottom: 300 }}>
                      <iframe id="dbuzz-widget-1"
                        title="Dbuzz share button"
                        className="dbuzz-share-button"
                        allowtransparency="true"
                        scrolling="no"
                        frameBorder="0"
                        style={{ position: "static", visibility: "visible", width: '76px', height: '28px' }}
                        src={hostUrl + "/widgets/buzz_button.html#id=dbuzz-widget-1&size=l&text=Hello world&url=" + hostUrl + "&tags=dbuzz,hive"}></iframe>
                    </div>
                  </div>
                </div>
              </section>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default Developers
