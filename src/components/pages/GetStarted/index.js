import React from 'react'
import Scrollspy from 'react-scrollspy'
import { HashLink } from 'react-router-hash-link'
import { createUseStyles } from 'react-jss'
import { Sticky, StickyContainer } from 'react-sticky'
import Image from 'react-bootstrap/Image'
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
    '@media (max-width: 400px)': {
      paddingTop: 40,
    },
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
  sticky: {
    '@media (max-width: 500px)' : {
      zIndex: 1,
      backgroundColor: theme.background.primary,
    },
  },
}))

const GetStarted = () => {

  const classes = useStyles()
  return (
    <React.Fragment>
      <Container maxWidth="md" fluid>
        <div className={classes.wrapper}>
          <StickyContainer>
            <Row>
              <Col md={5} xs={12}>
                <Sticky>
                  {({ style }) => (
                    <div style={{...style}} className={classes.sticky}>
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
                      ]} currentClassName={classes.currentLink} className={classes.sideWrapper}>
                        <li><HashLink to="#section-1">What is D.Buzz?</HashLink></li>
                        <li><HashLink to="#section-2">How to Sign-up for D.Buzz?</HashLink></li>
                        <li><HashLink to="#section-3">How to Switch Accounts?</HashLink></li>
                        <li><HashLink to="#section-4">How to Mute & Unmute?</HashLink></li>
                        <li><HashLink to="#section-5">How to Buzz-to-Twitter?</HashLink></li>
                        <li><HashLink to="#section-6">How to Embed Buzz Button?</HashLink></li>
                        <li><HashLink to="#section-7">Guide for Writing on D.Buzz?</HashLink></li>
                        <li><HashLink to="#section-8">How to Cite Sources?</HashLink></li>
                        <li><HashLink to="#section-9">How to Buy $HIVE to Power Up?</HashLink></li>
                      </Scrollspy>
                    </div>
                  )}
                </Sticky>
              </Col>
              <Col>
                <div className={classes.innerWrapper}>
                  <section id="section-1">
                    <div className={classes.hero}>
                      <div>
                        <h3>What is D.Buzz?</h3>
                      </div>
                      <hr />
                      <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=hellomsq/rmivqzsw"
                            allowFullScreen={true}
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=hellomsq/rmivqzsw">https://3speak.co/watch?v=hellomsq/rmivqzsw</a></i></p>
                        <br />
                        <p>
                          <b>D.Buzz</b> is a micro-blogging platform that allows users to create accounts, join in conversations, and post their own content.
                        </p>
                        <p>
                          <b>D.Buzz's</b> mission is to promote freedom of speech and the rights of users, with a little help from blockchain technology.
                        </p>
                        <p>
                          <b>D.Buzz</b> censorship resistance is king and users are in control. Advanced content delivery algorithms used by big social media companies have drawn a razor-thin line between whether these companies are defined as platfroms or publishers, terms that each carry unique legal implications.
                        </p>
                        <p>
                          Big social media appears to be presenting themselves as platforms, public forums which would be protected from certain liabilities under the US Communications Decency Act. However, they are also engaging in what is known as 'Algorithmic Censorship', a practice that would technically classify them as publishers, disqualifying them from Communications Decency Act.
                        </p>
                        <p>
                          <b>D.Buzz</b> is different. They are creating a censorship-resistant platform powered by the Hive Blockchain. This is great for users because they get freedom of speech in regards to what they post, they truly own their content, and they get improved content curation as well as less ads.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-2">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Sign-up for D.Buzz?</h3>
                      </div>
                      <hr />
                      <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=jacuzzi/ksllvfbj"
                            allowFullScreen={true}
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=jacuzzi/ksllvfbj">https://3speak.co/watch?v=jacuzzi/ksllvfbj</a></i></p>
                        <br />
                        <h2>
                        Steps to Sign Up to D.Buzz:
                        </h2>
                        <br />
                        <ol>
                          <li>
                            <i>
                              Go to the big sign-up button. 
                              This will bring you to the <a href="https://hiveonboard.com/create-account?ref=dbuzz&redirect_url=https://d.buzz/login"target="_blank" rel="noopener noreferrer">hiveonboard.com</a> webpage. 
                              This is where you go to sign-up for a new account.
                            </i>
                          </li>
                          <li>
                            <i>
                              When you land on the page, scroll down. Head towards where it says <b> Username </b> and type in a username you like. 
                              It should not start with a space or number. Start with a couple of letters to find a unique username. 
                              <br /> <b>Please Note: Currently there are no ways to change the username on the Hive blockchain or on D.Buzz, so once you select one it is yours for life.</b> 
                            </i>
                          </li>
                          <li>
                            <i>
                              After you found your username that is acceptable, agree to the Terms of Service and hit continue.
                            </i>
                          </li> 
                          <li>
                            <i>
                              The second phase on creating the account is to backup your account keys. Your account keys are unique to you, we at <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a> do not control or have access to them.  If you lose all the copies of your keys, you will not be able to login to your account or interact on the HIVE blockchain, in any fashion.
                              <br /> <b>Note: It is important to keep these keys very safe and keep these numbers with you. Do not give these out to anyone who asks for them. As they can take ownership of your account and transfer your money away.</b> <br />To interact with D.Buzz we only use your posting key to login. Hit the download backup button.
                            </i>
                          </li>
                          <li>
                            <i>
                              Continue by pressing the <b>CREATE HIVE ACCOUNT</b>, it would ask for a one-time-code phone verification. This is a one time process to enable authenticity on the blockchain. Hive Onboard will not sell your phone number to any 3rd-parties or use it in any marketing efforts. It is to verify the authenticity of you and to make sure that people do not take advantage of the system.   
                            </i>
                          </li>
                          <li>
                            <i>
                              Enter your phone number and click the request SMS button. In a few moments a number will arrive on your phone.
                            </i>
                          </li>
                          <li>
                            <i>
                              After completing the verification process, you will be re-routed back to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a> platform for logging in.
                            </i>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </section>
                  <section id="section-3">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Switch Accounts?</h3>
                      </div>
                      <hr />
                      <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=jacuzzi/yydvvemc"
                            allowFullScreen={true}
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=jacuzzi/yydvvemc">https://3speak.co/watch?v=jacuzzi/yydvvemc</a></i></p>
                        <br />
                        <p>
                          The Switch Accounts feature allows you to login to multiple accounts and switch between them.
                        </p>
                        <h2>
                          Steps for using Switch Accounts Feature with D.Buzz:
                        </h2>
                        <ol>
                          <li>
                            <i>
                              Log in to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>, after logging in, you will see down at the bottom that you are logged in. But then above the Buzz button, you can see a Switch Account button and click it.
                            </i>
                          </li>
                          <li>
                            <i>
                              You will be shown an interface for switching accounts, click the Add User button.
                            </i>
                          </li>
                          <li>
                            <i>
                              You will be prompted back to the login page, and enter the other account you have. <br /><b>Note: You can either use your posting key directly or hivekeychain</b>
                            </i>
                          </li>
                          <li>
                            <i>
                              After logging in, the page page will refresh and it will show the current account you signed into on  <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>. 
                            </i>
                          </li>
                          <li>
                            <i>
                              Upon opening the interface for switching accounts it will show the online and offline accounts. You can toggle the different accounts to switch between accounts faster, upon clicking the desired account the page will automatically refresh.
                            </i>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </section>
                  <section id="section-4">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Mute & Unmute?</h3>
                      </div>
                      <hr />
                      <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=jacuzzi/kkdhlwsy"
                            allowFullScreen={true}
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=jacuzzi/kkdhlwsy">https://3speak.co/watch?v=jacuzzi/kkdhlwsy</a></i></p>
                        <br />
                        <p>
                          In <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a> you can mute an author that you do not like or maybe content you do not like as well. 
                        </p>
                        <h2>
                          Steps for using the Mute & Unmute features with D.Buzz:
                        </h2>
                        <ol>
                          <li>
                            <i>
                              Look for a post, and go to the top-right side where you see the drop-down caret.
                            </i>
                          </li>
                          <li>
                            <i>
                              Upon clicking it, you'll get a window and you can click the mute button. Note: This author will be removed from your news feed, until you turn them back on. This will be removed from your news feed on all front-ends that works on the Hive blockchain, this includes: PeakD, Hive.Blog, and others. So when you have clicked the Mute button, you'll get the option to add the author to your list of muted users.
                            </i>
                          </li>
                          <li>
                            <i>
                              After, you will see a confirmation on the bottom-right side.
                            </i>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </section>
                  <section id="section-5">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Buzz-to-Twitter?</h3>
                      </div>
                      <hr />
                      <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=jacuzzi/rvdfuood"
                            allowFullScreen={true}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=jacuzzi/rvdfuood">https://3speak.co/watch?v=jacuzzi/rvdfuood</a></i></p>
                        <br />
                        <h2>
                          Steps for using the Buzz-to-Twitter feature on D.Buzz:
                        </h2>
                        <ol>
                          <li>
                            <i>
                              Create a new Buzz, just by clicking the Buzz button on the left-side of the interface.
                            </i>
                          </li>
                          <li>
                            <i>
                              Add text that you like for the particular post, add tags to your liking.
                            </i>
                          </li>
                          <li>
                            <i>
                              Go down and click the Buzz button. <br /><b> Note: Your Buzz will be posted to the Hive blockchain once you click the Buzz button </b>.
                            </i>
                          </li>
                          <li>
                            <i>
                              After your Buzz is posted you will have a confirmation on the bottom-right side.
                            </i>
                          </li>
                          <li>
                            <i>
                              Scroll down a little bit, and at the bottom you'll notice a three dots icon.
                            </i>
                          </li>
                          <li>
                            <i>
                              Click the three dots icon button, and you have now the option to edit your Buzz or Buzz it to Twitter.
                            </i>
                          </li>
                          <li>
                            <i>
                              Click the Buzz-to-Twitter button. As long as you are logged into your Twitter account, you'll see a window pop up. Enabling you to share the Buzz directly with Twitter. And once you're good with the result of what you want to share, click the Tweet button from Twitter.
                            </i>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </section>
                  <section id="section-6">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Embed Buzz Button?</h3>
                      </div>
                      <hr />
                      <div>
                        <h2>
                          Embed and Buzz Directly from any web page!
                        </h2>
                        <Image src="https://images.hive.blog/768x0/https://files.peakd.com/file/peakd-hive/dbuzz/Q7uZYyuv-BuzzButton.png" fluid />
                        <br />
                        <br />
                        <p>
                          A handy-dandy button you can add to any web page and enable your users in one click, to Buzz to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>.
                        </p>
                        <p>
                          Here is what the button looks like.
                        </p>
                        <center>
                          <Image src="https://images.hive.blog/768x0/https://files.peakd.com/file/peakd-hive/dbuzz/xunE9X7h-BuzzButton.png" fluid/>
                        </center>
                        <br />
                        <br />
                        <p>
                          Basically, The Buzz button is a small button displayed on your website where viewers can easily share content onto <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>. It consists of two parts; a link to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>'s 'Buzz' composer and the BuzzWidget.js script to enhance the link with the easily identifiable Buzz button.
                        </p>
                        <p>
                          The simplified explanation is when you click the button, a pop-up window comes up linking to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz/#/intent/buzz">https://d.buzz/#/intent/buzz</a>.
                        </p>
                        <p>
                          The magic happens in what information you can pass along to that pop-up window. For now however let's review how to add a 'Buzz' button to your webpage or, DApp.
                        </p>
                        <br />
                        <h2>
                          How to add a Buzz button in your website?
                        </h2>
                        <p>Create a new anchor element with a <code>dbuzz-share-button</code> class to allow the <code>buzzWidget.js</code> script to discover the element and turn it into a Buzz Button.</p>
                        <p>
                          Set the href attribute value to <a target="_blank" rel="noopener noreferrer" href="https://d.buzz/#/intent/buzz">https://d.buzz/#/intent/buzz</a> to create a link that redirects to the DBuzz Web Intent Composer.
                        </p>
                        <code>&lt;a&nbsp;class="dbuzz-share-button" href="https://d.buzz/#/intent/buzz"&gt;Buzz&lt;/a&gt;</code>
                        <br />
                        <br />
                        <p>
                          Set the Buzz text by customizing Buzz web intent query parameters.
                        </p>
                        <code>&lt;a&nbsp;class="dbuzz-share-button" href="https://d.buzz/#/intent/buzz?text=Hello%20dbuzz"&gt;Buzz&lt;/a&gt;</code>
                        <br />
                        <br />
                        <p>
                          Customize Buzz button parameters using data/attributes.
                        </p>
                        <code>&lt;a class="dbuzz-share-button" href="https://d.buzz/#/intent/buzz" data-text="Hello dbuzz" data-size="large" data-hashtags="dbuzz,hive" data-url="https://d.buzz"&gt;Buzz&lt;/a&gt;</code>
                        <br />
                        <br />
                        <p>
                          Include BuzzWidget.js script once in your page template to enable tracking of Buzz button widget JavaScript events.
                        </p>
                        <code>&lt;script type="text/javascript" src="https://d.buzz/buzzWidget.js"&gt;&lt;/script&gt;</code>
                        <br />
                        <br />
                        <h2>
                          Buzz web intent query parameters
                        </h2>
                        <br />
                        <b>
                          <p>
                            The Text parameter:
                          </p>
                        </b>
                        <li>
                          <i>
                            Appears preselected in a Buzz composer. If not set, it may be auto-populated from the web page's title element.
                          </i>
                        </li>
                        <br />
                        <b>
                          <p>
                            The URL parameter:
                          </p>
                        </b>
                        <li>
                          <i>
                            Contains an absolute HTTP or HTTPS URL to be shared on DBuzz. If not set, it may be auto-populated from location.href of the page.
                          </i>
                        </li>
                        <br />
                        <b>
                          <p>
                            The Tags' parameter:
                          </p>
                        </b>
                        <li>
                          <i>
                            Must be separated with a comma. Do not include a preceding "#" from each hashtag; the Buzz composer will automatically add the proper space-separated hashtag.
                          </i>
                        </li>
                        <br />
                        <b>
                          <p>
                            Buzz Button customization: 
                          </p>
                        </b>
                        <li>
                          <i>
                            Add a data-size attribute value of "large" to display a larger Buzz button
                          </i>
                        </li>
                        <br />
                        <br />
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://hive.blog/hive-139531/@dbuzz/embed-and-buzz-directly-from-any-web-page-meet-the-embed-buzz-button">https://hive.blog/hive-139531/@dbuzz/embed-and-buzz-directly-from-any-web-page-meet-the-embed-buzz-button</a></i></p>
                      </div>
                    </div>
                  </section>
                  <section id="section-7">
                    <div className={classes.hero}>
                      <div>
                        <h3>Guide for Writing on D.Buzz?</h3>
                      </div>
                      <hr />
                      <div>
                        <h2>
                          Tips on writing for <a target="_blank" rel="noopener noreferrer" href="https://d.buzz">D.Buzz</a>, What to Buzz about...
                        </h2>
                        <Image src="https://images.hive.blog/768x0/https://files.peakd.com/file/peakd-hive/dbuzz/5Xnr4KcU-wahttobuzzabout.jpeg" fluid />
                        <br />
                        <br />
                        <p>
                          We've all sat there and looked at a blank screen and said OMG, what to say. This is a writer's worst fear. However with a couple of starting ideas you'll be well on your way to typing out engaging content.
                        </p>
                        <h2>
                          Below you'll find 18 ideas on topics you can post about on DBuzz.
                        </h2>
                        <ol>
                          <li>
                            <b>Take a poll about something</b>
                            <br />
                            <i>
                              - This is a classic engagement method to allow you to ask your audience questions and get feedback from.
                            </i>
                          </li>
                          <li>
                            <b>Get a Testimonial from somebody</b>
                            <br />
                            <i>
                              - Are you posting about a Product or Service? Just Buzz that good recommendation you got. You can get a nice follow-up and help spread your message!
                            </i>
                          </li>
                          <li>
                            <b>Provide some tips and tricks</b>
                            <br />
                            <i>
                              - Chances are good you know something about something. Share that knowledge with the community and make a short buzz about it. It's a great way to help your fellow HIVE users and increases your engagement!
                            </i>
                          </li>
                          <li>
                            <b>Promote a product or service</b>
                            <br />
                            <i>
                              - Sometimes it's good to just say you like this thing or that thing, or these things. Perhaps even you'd like to say you like to use D.Buzz. Seriously there's a whole industry based upon content marketing in this way.
                            </i>
                          </li>
                          <li>
                            <b>Talk about topics that are trending</b>
                            <br />
                            <i>
                              - D.Buzz is a great platform to Notify other users and people about recent news. From who won the Golden Globe awards, to breaking news that people should be aware about.
                            </i>
                          </li>
                          <li>
                            <b>It's a classic but motivational quotes.</b>
                            <br />
                            <i>
                              - Anytime I think of motivational quotes I think of that Hang on a telephone line with the phrase "hang in there". lol. everybody needs a pickup now and then, and a good motivational quote helps people keep going! Just be sure to add in your own thoughts about the quote in the Buzz, that will make sure it's #OriginalContent.
                            </i>
                          </li>
                          <li>
                            <b>Post about opening your company</b>
                            <br />
                            <i>
                              - Is the place that you are working looking for employees? Are you looking for a new employee or contract worker or remote worker? D.Buzz could be a perfect place to get that message out.
                            </i>
                          </li>
                          <li>
                            <b>Holidays on social media</b>
                            <br />
                            <i>
                              - There are lots of crazy holidays out there, sometimes two or three per day, some obscure like national talk on elevator day, some more known like Christmas. These make great posts in leading up to and after these holidays!
                            </i>
                          </li>
                          <li>
                            <b>Some upcoming event</b>
                            <br />
                            <i>
                              - We are always going out to do things, these make great conversational starters and perhaps a way to PRE network with someone, that later you can link up with at an event that you're going to as well. Buzz about it and find out.
                            </i>
                          </li>
                          <li>
                            <b>Prelaunch / Teaser launches</b>
                            <br />
                            <i>
                              - Perhaps you have a new service or product that is coming out soon, Get some buzz going for the big launch day by doing a teaser launch. This has been used with great success in the past.
                            </i>
                          </li>
                          <li>
                            <b>Exciting visual content</b>
                            <br />
                            <i>
                              - Perhaps an info graphic or picture you made, even branded content, imagery stands out and gets a lot of media attention. A couple of well-placed images and you can be well on your way to high engagement.
                            </i>
                          </li>
                          <li>
                            <b>Share excerpts from your blog</b>
                            <br />
                            <i>
                              - We know you are are a prolific blog Writer and your content hits 2000 words each time. Consider taking a few small excerpts from this and scheduling a couple of Buzz's for the future to help promote this killer content!
                            </i>
                          </li>
                          <li>
                            <b>Is there a flash sale or promo code</b>
                            <br />
                            <i>
                              - This could be a code that you used to get a discount on something you offer, or perhaps you found a good discount code online for a service that a lot of your readers use. Post this discount code online and help your readers save!
                            </i>
                          </li>
                          <li>
                            <b>Memes and animated GIFs</b>
                            <br />
                            <i>
                              - Lol, the Internet was almost made for these things (and cat photos). Posting a Meme could be a great way to make use of a Buzz and brighten someone's day.
                            </i>
                          </li>
                          <li>
                            <b>Announcements about your brand</b>
                            <br />
                            <i>
                              - Does your company or product have a big announcement that's coming up? Again this would make for a fantastic Buzz to put on D.Buzz!
                            </i>
                          </li>
                          <li>
                            <b>News that is related to your industry</b>
                            <br />
                            <i>
                              - Have you've stumbled across an interesting piece of news that is related to your industry? A fantastic read on something that revolves around what you do? This could be fantastic content to share with your readers and chances are they are interested in it to.
                            </i>
                          </li>
                          <li>
                            <b>Ask a Question to get response</b>
                            <br />
                            <i>
                              - This is a great way to gather information from your audience but also push your engagement up. Everyone likes to answer questions and feel important because well, their voice is important.
                            </i>
                          </li>
                          <li>
                            <b>Tell a joke</b>
                            <br />
                            <i>
                              - If people are smiling, they are happy, if they are happy they want to hear what you have to say. Tell a joke and get people smiling!
                            </i>
                          </li>
                        </ol>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://hive.blog/hive-174578/@dbuzz/tips-on-writing-for-d-buzz-what-to-buzz-about">https://hive.blog/hive-174578/@dbuzz/tips-on-writing-for-d-buzz-what-to-buzz-about</a></i></p>
                      </div>
                    </div>
                  </section>
                  <section id="section-8">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Cite Sources?</h3>
                      </div>
                      <hr />
                      <div>
                        <h2>
                          Proper Ways to Cite sources in Micro-Blogging
                        </h2>
                        <Image src="https://images.hive.blog/768x0/https://files.peakd.com/file/peakd-hive/dbuzz/wa9P61MT-Citesources_Bloggings.png" fluid />
                        <br />
                        <br />
                        <p>
                          One of the fastest ways to gain exposure in micro blogging is to share content. However, blindly sharing content without following internet etiquette can land you in hot soup. Your page can get banned, or you may be sued. Plus, knowing the proper ways to cite sources will help you grow much faster and build better collaborations.
                        </p>
                        <p>
                          So what are the proper ways to cite resources in micro blogging?
                        </p>
                        <p>
                          Read on to make sure you are doing it right!
                        </p>
                        <h2>
                          Give credit when it is due
                        </h2>
                        <p>
                          Because of the plethora of resources on the internet, coming up with something original is tough. When marketers come up with new content, know that it takes hard work and brainstorming hours. So owners can get protective because some people try to take credit for the work without putting in the effort.
                        </p>
                        <p>
                          Whether it is a quote, articles, or visual content, the first etiquette in citing sources is to give credit to the owner. If it is a repost, don’t be scared to ask for the source. If it is unavailable, credit your reference so that you don’t get into trouble.
                        </p>
                        <h2>
                          Indicate that it is a copy
                        </h2>
                        <p>
                          When you are not the owner or the creator of the content, it is crucial to indicate that it is a copy. Depending on the terminology of the handles, suggest that your post is not the original copy with “repost,” “Retweet/RT, ReBuzz/RB” MT / MB (modified tweet / Modified Buzz), etc.
                        </p>
                        <p>
                          Indicating that your post is a copy is crucial, especially when you are <a target="_blank" rel="noopener noreferrer" href="https://www.lexico.com/definition/newsjacking">news jacking</a>. That way, viewers can check the authenticity of the report by doing further research on their own. It is also a thoughtful way to acknowledge the owners for being the first to break the news.
                        </p>
                        <p>
                          For statistical data, make sure you link the same page where you got the data, not just the publishing website. Viewers should be able to land right on the exact page of origin.
                        </p>
                        <h2>
                          Create an inbound link to your source
                        </h2>
                        <p>
                          One of the best ways to collaborate and show credibility with half the effort is by creating inbound links to your source. If you copy or modify the content, link it to the page or an exciting page to their site.
                        </p>
                        <p>
                          If they have a website or other micro blogging sites, hyperlink the social media handles or websites. This prevents content plagiarism, impacts both organic ranking, and helps you grow individually.
                        </p>
                        <h2>
                          Check content usage guidelines
                        </h2>
                        <p>
                          Many big companies provide content usage guidelines for cite sourcing. If you are not sure how to credit the site, check for the usage guideline. Most of them have simple rules to follow and usually allow up to 75 words without credit.
                        </p>
                        <p>
                          If you don’t find any warnings or guidelines, you may use the content, but legally, it is still illegal plagiarism. So make sure you mention the source in the description or the footnote.
                        </p>
                        <h2>
                          Use the “@username” for Social media
                        </h2>
                        <p>
                          Almost all social media platforms use the “@” to indicate a username. So whether it is Instagram, Facebook, or even YouTube, referring to a user is very convenient when sharing content. You can also use the share button to cite your source or copy the URL directly to indicate the origin. That way, viewers can do independent research and establish your credibility.
                        </p>
                        <p>
                          This is not an extensive list of ways to cite sources on the blockchain, but if you follow common sense and move with good intentions, then you should be ok.
                        </p>

                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://hive.blog/hive-167922/@dbuzz/proper-ways-to-cite-sources-in-micro-blogging">https://hive.blog/hive-167922/@dbuzz/proper-ways-to-cite-sources-in-micro-blogging</a></i></p>
                      </div>
                    </div>
                  </section>
                  <section id="section-9">
                    <div className={classes.hero}>
                      <div>
                        <h3>How to Buy $HIVE to Power Up?</h3>
                      </div>
                      <hr />
                      <div style={{paddingBottom: 200}}>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
                          <iframe
                            title='Embedded Video'
                            src="https://3speak.co/embed?v=jacuzzi/xiqtpcpw"
                            allowFullScreen={true}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder='0'
                            loading="lazy"
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                          />
                        </div>
                        <p>Source: <i><a target="_blank" rel="noopener noreferrer" href="https://3speak.co/watch?v=jacuzzi/xiqtpcpw">https://3speak.co/watch?v=jacuzzi/xiqtpcpw</a></i></p>
                        <br />
                        <p>
                          <b>Goals:</b> 
                          <ol>
                            <li>
                              Buy $Hive coins
                            </li>
                            <li>
                              Power Up $Hive on your acccount
                            </li>
                          </ol>
                        </p>
                        <p>
                          <b>Requirements:</b> 
                          <ol>
                            <li>
                              A Hive Account and Username (@username)
                            </li>
                            <li>
                              A Blocktrades Account
                            </li>
                            <li>
                              Log into PeakD
                            </li>
                            <li>
                              BTC (Bitcoin or other Crypto Asset)
                            </li>
                          </ol>
                        </p>
                        <h2>
                          Steps on buying Hive from Blocktrades:
                        </h2>
                        <ol>
                          <li>
                            <i>
                              Go to <a target="_blank" rel="noopener noreferrer" href="https://blocktrades.us/en/">blocktrades.us</a>
                            </i>
                          </li>
                          <li>
                            <i>
                              Sign up for an account in Blocktrades.
                            </i>
                          </li>
                          <li>
                            <i>
                              After creating an account, sign into Blocktrades. <br /> <b>Note: You have the option to verify your account or not. If you do not verify your account, you'll be limited to $1,750 USD for trade and daily trade.</b>
                            </i>
                          </li>
                          <li>
                            <i>
                              Go to send and select Bitcoin (BTC)
                            </i>
                          </li>
                          <li>
                            <i>
                              On receive, select $Hive.
                            </i>
                          </li>
                          <li>
                            <i>
                              Enter the desired amount of BTC to be converted to Hive.
                            </i>
                          </li>
                          <li>
                            <i>
                              Scroll down a bit, enter your username at Hive. After, click the get deposit address button. <br /> <b>Note: This will open a new interface which includes the depositing address. You can send any amount up to your daily trading limit.</b>
                            </i>
                          </li>
                          <li>
                            <i>
                              Go to your external wallet and send the desired amount to the address that was provided.
                            </i>
                          </li>
                          <li>
                            <i>
                              After a several confirmations on the transaction, you will receive your $Hive coins.
                            </i>
                          </li>
                        </ol>
                        <h2>
                          Steps for Powering Up your Hive Account:
                        </h2>
                        <ol>
                          <li>
                            <i>
                              Go to <a target="_blank" rel="noopener noreferrer" href="https://peakd.com/">peakd.com</a> and login your Hive account.
                            </i>
                          </li>
                          <li>
                            <i>
                              Click the avatar on the top-right side of the interface, it should show a list of options. Go down to where it says Wallet and click, this would show your wallet screen.
                            </i>
                          </li>
                          <li>
                            <i>
                              Once the transaction of converting your BTC to Hive is done, after several confirmations, it will show up in your wallet as Hive Tokens (Hive)
                            </i>
                          </li>
                          <li>
                            <i>
                              Go to the right-middle side beside the send button, click the bottom-facing caret icon. It will show options and click Power Up. <br /> <b>Note: It will show a modal form which is asking how much you will power up. </b>
                            </i>
                          </li>
                          <li>
                            <i>
                              Once you are done deciding how much HIVE you want to Power Up, click continue to proceed. Click confirm once Hive Keychain prompts the confirmation (if you are using HIVE Keychain).
                            </i>
                          </li>
                          <li>
                            <i>
                              Scroll down, and after a few transaction cycles, you will see it appear in your transaction's below.
                            </i>
                          </li>
                        </ol>
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

export default GetStarted