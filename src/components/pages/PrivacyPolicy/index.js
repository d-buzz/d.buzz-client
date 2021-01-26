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
    textAlign: 'justify',
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

const PrivacyPolicy = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Container maxWidth="md" fluio>
        <div className={classes.wrapper}>
          <div className={classes.outsideWrapper}>
            <p>
            Thank you for choosing to be part of our community at D.Buzz (“Company”, “we”, “us”, or “our”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at buzz@d.buzz.
            When you visit our website <a href="https://d.buzz/">https://d.buzz/</a> (the "Website"), use our mobile application, as the case may be (the "App") and more generally, use any of our services (the "Services", which include the Website and App), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
            This privacy notice applies to all information collected through our Services (which, as described above, includes our Website and App), as well as any related services, sales, marketing or events.
            Please read this privacy notice carefully as it will help you understand what we do with the information that we collect.

            </p>
          </div>
          <StickyContainer>
            <Row>
              <Col xs={5} className="d-none d-md-block">
                <Sticky>
                  {({ style }) => (
                    <div style={{...style}}>
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
                        'section-10',
                        'section-11',
                        'section-12',
                        'section-13',
                        'section-14',
                        'section-15',
                      ]} currentClassName={classes.currentLink} className={classes.sideWrapper}>
                        <li><HashLink to="#section-1">What information do we collect?</HashLink></li>
                        <li><HashLink to="#section-2">How do we use your information?</HashLink></li>
                        <li><HashLink to="#section-3">Will your information be shared with anyone?</HashLink></li>
                        <li><HashLink to="#section-4">Do we use cookies and other tracking technologies?</HashLink></li>
                        <li><HashLink to="#section-5">Do we use google maps?</HashLink></li>
                        <li><HashLink to="#section-6">How do we handle your social logins?</HashLink></li>
                        <li><HashLink to="#section-7">Is your information transferred internationally?</HashLink></li>
                        <li><HashLink to="#section-8">What is our stance on third-party websites?</HashLink></li>
                        <li><HashLink to="#section-9">How long do we keep your information?</HashLink></li>
                        <li><HashLink to="#section-10">How do we keep your information safe?</HashLink></li>
                        <li><HashLink to="#section-11">What are your privacy rights?</HashLink></li>
                        <li><HashLink to="#section-12">Controls for do-not-track features</HashLink></li>
                        <li><HashLink to="#section-13">Do California residents have specific privacy rights?</HashLink></li>
                        <li><HashLink to="#section-14">Do we make updates to this notice?</HashLink></li>
                        <li><HashLink to="#section-15">How can you contact us about this notice?</HashLink></li>
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
                        <h3>What information do we collect?</h3>
                      </div>
                      <hr />
                      <div>
                        <h5>
                          Information automatically collected
                        </h5>
                        <p>
                          In Short:  Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.
                        </p>
                        <p>
                          We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about who and when you use our Services and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
                        </p>
                        <p>
                          Like many businesses, we also collect information through cookies and similar technologies.  
                        </p>
                        <p>
                          The information we collect includes:
                        </p>
                        <ul>
                          <li> 
                            <i>
                              Log and Usage Data. Log and usage data is service-related, diagnostic usage and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps') and hardware settings).
                            </i>
                          </li>
                          <li>
                            <i>
                              Device Data. We collect device data such as information about your computer, phone, tablet or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device application identification numbers, location, browser type, hardware model Internet service provider and/or mobile carrier, operating system configuration information.
                            </i>
                          </li>
                          <li>
                            <i>
                              Location Data. We collect information data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type of settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Locations settings on your device. Note however, if you choose to opt out, you may not be able to use certain aspects of the Services.
                            </i>
                          </li>
                        </ul>
                        <h5>
                          Information collected through our App
                        </h5>
                        <i>
                          In Short:  We collect information regarding your geo-location, mobile device, push notifications, when you use our App.
                        </i>
                        <br />
                        <br />
                        <p>
                          If you use our App, we also collect the following information:
                        </p>

                        <ul>
                          <li>
                            <i>
                              Geo-Location Information. We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our App, to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.
                            </i>
                          </li>
                          <li>
                            <i>
                              Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device's camera, sms messages, social media accounts, storage, and other features. If you wish to change our access or permissions, you may do so in your device's settings.
                            </i>
                          </li>
                          <li>
                            <i>
                              Mobile Device Data. We automatically collect device information (such as your mobile device ID, model and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our App, we may also collect information about the phone network associated with your mobile device, your mobile device's operating system or platform, the type of mobile device you use, your mobile device's unique device ID and information about the features of our App you accessed.
                            </i>
                          </li>
                          <li>
                            <i>
                              Push Notifications. We may request to send you push notifications regarding your account or certain features of the App. If you wish to opt-out from receiving these types of communications, you may turn them off in your device's settings.
                            </i>
                          </li>
                          <br />
                          <p>
                            The information is primarily needed to maintain the security and operation of our App, for troubleshooting and for our internal analytics and reporting purposes.
                          </p>
                        </ul>
                        <h5>
                          Information collected from other sources
                        </h5>
                        <i>
                          In Short:  We may collect limited data from public databases, marketing partners, social media platforms, and other outside sources.
                        </i>
                        <p>
                        In order to enhance our ability to provide relevant marketing, offers and services to you and update our records, we may obtain information about you from other sources, such as public databases, joint marketing partners, affiliate programs, data providers, social media platforms, as well as from other third parties. This information includes mailing addresses, job titles, email addresses, phone numbers, intent data (or user behavior data), Internet Protocol (IP) addresses, social media profiles, social media URLs and custom profiles, for purposes of targeted advertising and event promotion. If you interact with us on a social media platform using your social media account (e.g. Facebook or Twitter), we receive personal information about you such as your name, email address, and gender. Any personal information that we collect from your social media account depends on your social media account's privacy settings.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-2">
                    <div className={classes.hero}>
                      <div>
                        <h3>How do we use your information?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
                        </i>
                        <p>
                          We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
                        </p>
                        <p>
                          We use the information we collect or receive:
                        </p>
                        <ul>
                          <li>
                            <i>
                              To facilitate account creation and logon process. If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract. See the section below headed "HOW DO WE HANDLE YOUR SOCIAL LOGINS" for further information.
                            </i>
                          </li>
                          <li>
                            <i>
                              To post testimonials. We post testimonials on our Services that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and the consent of the testimonial. If you wish to update, or delete your testimonial, please contact us at buzz@d.buzz and be sure to include your name, testimonial location, and contact information.
                            </i>
                          </li>
                          <li>
                            <i>
                              Request feedback. We may use your information to request feedback and to contact you about your use of our Services.
                            </i>
                          </li>
                          <li>
                            <i>
                              To enable user-to-user communications. We may use your information in order to enable user-to-user communications with each user's consent.
                            </i>
                          </li>
                          <li>
                            <i>
                              To manage user accounts. We may use your information for the purposes of managing our account and keeping it in working order.
                            </i>
                          </li>
                          <li>
                            <i>
                              To send administrative information to you. We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.
                            </i>
                          </li>
                          <li>
                            To protect our Services. We may use your information as part of our efforts to keep our Services safe and secure (for example, for fraud monitoring and prevention).
                          </li>
                          <li>
                            <i>
                              To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.
                            </i>
                          </li>
                          <li>
                            <i>
                              To respond to legal requests and prevent harm. If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.
                            </i>
                          </li>
                          <li>
                            <i>
                              Fulfill and manage your orders. We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.
                            </i>
                          </li>
                          <li>
                            <i>
                              Administer prize draws and competitions. We may use your information to administer prize draws and competitions when you elect to participate in our competitions.
                            </i>
                          </li>
                          <li>
                            <i>
                              To deliver and facilitate delivery of services to the user. We may use your information to provide you with the requested service.
                            </i>
                          </li>
                          <li>
                            <i>
                              To respond to user inquiries/offer support to users. We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.
                            </i>
                          </li>
                          <li>
                            <i>
                              To send you marketing and promotional communications. We and/or our third-party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. For example, when expressing an interest in obtaining information about us or our Services, subscribing to marketing or otherwise contacting us, we will collect personal information from you. You can opt-out of our marketing emails at any time (see the "WHAT ARE YOUR PRIVACY RIGHTS" below).
                            </i>
                          </li>
                          <li>
                            <i>
                              Deliver targeted advertising to you. We may use your information to develop and display personalized content and advertising (and work with third parties who do so) tailored to your interests and/or location and to measure its effectiveness.
                            </i>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  <section id="section-3">
                    <div className={classes.hero}>
                      <div>
                        <h3>Will your information be shared with anyone?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations
                        </i>
                        <p>
                          We may process or share your data that we hold based on the following legal basis:
                        </p>
                        <ul>
                          <li>
                            <i>
                              Consent: We may process your data if you have given us specific consent to use your personal information in a specific purpose.
                            </i>
                          </li>
                          <li>
                            <i>
                              Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.
                            </i>
                          </li>
                          <li>
                            <i>
                              Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
                            </i>
                          </li>
                          <li>
                            <i>
                              Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).
                            </i>
                          </li>
                          <li>
                            <i>
                              Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.
                            </i>
                          </li>
                        </ul>
                        <p>
                          More specifically, we may need to process your data or share your personal information in the following situations:
                        </p>
                        <ul>
                          <li>
                            <i>
                              Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                            </i>
                          </li>
                          <li>
                            <i>
                              Business Partners. We may share your information with our business partners to offer you certain products, services or promotions.
                            </i>
                          </li>
                          <li>
                            <i>
                              Other Users. When you share personal information (for example, by posting comments, contributions or other content to the Services) or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity. If you interact with other users of our Services and register for our Services through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity. Similarly, other users will be able to view descriptions of your activity, communicate with you within our Services, and view your profile.
                            </i>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  <section id="section-4">
                    <div className={classes.hero}>
                      <div>
                        <h3>Do we use cookies and other tracking technologies?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We may use cookies and other tracking technologies to collect and store your information.
                        </i>
                        <p>
                          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-5">
                    <div className={classes.hero}>
                      <div>
                        <h3>Do we use google maps?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          In Short:  Yes, we use Google Maps for the purpose of providing better service.
                        </p>
                        <p>
                          This Website or App uses Google Maps APIs which is subject to Google's Terms of Service. You may find the Google Maps APIs Terms of Service <a href="https://cloud.google.com/maps-platform/terms/">here</a>. To find out more about Google’s DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?, please refer to this <a href="https://policies.google.com/privacy">link</a>.
                          We use the Google Maps API to retrieve certain information when you make location-specific requests. This includes:
                        </p>
                        <p>
                          For a full list of what we use information for, please see the previous section titled "HOW DO WE USE YOUR INFORMATION?" and “WILL YOUR INFORMATION BE SHARED WITH ANYONE?”.
                        </p>
                        <p> 
                          The Maps APIs that we use store and access cookies and other information on your devices. If you are a user currently in the European Economic Area (EU countries, Iceland, Liechtenstein and Norway), please take a look at our Cookie Notice.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-6">
                    <div className={classes.hero}>
                      <div>
                        <h3>How do we handle your social logins?</h3>
                      </div>
                      <hr />
                      <div>
                        <p>          
                          By posting your Contributions to any part of the Site, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.
                        </p>
                        <p>
                          This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.
                        </p>
                        <p>
                          We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Site. You are solely responsible for your Contributions to the Site and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.  
                        </p>
                        <p>
                          We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to re-categorize any Contributions to place them in more appropriate locations on the Site; and (3) to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-7">
                    <div className={classes.hero}>
                      <div>
                        <h3>Is your information transferred internationally?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>In Short:  We may transfer, store, and process your information in countries other than your own.</i>
                        <p>
                          Our servers are located in. If you are accessing our Services from outside, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see "WILL YOUR INFORMATION BE SHARED WITH ANYONE?" above), in and other countries.
                        </p>
                        <p>
                          If you are a resident in the European Economic Area, then these countries may not necessarily have data protection laws or other similar laws as comprehensive as those in your country. We will however take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-8">
                    <div className={classes.hero}>
                      <div>
                        <h3>What is our stance on third-party websites?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We are not responsible for the safety of any information that you share with third-party providers who advertise, but are not affiliated with, our Website.
                        </i>
                        <p>
                          The Services may contain advertisements from third parties that are not affiliated with us and which may link to other websites, online services or mobile applications. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-9">
                    <div className={classes.hero}>
                      <div>
                        <h3>How long do we keep your information?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
                        </i>
                        <p>
                          We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than 1 year.
                        </p>
                        <p>
                          When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-10">
                    <div className={classes.hero}>
                      <div>
                        <h3>How do we keep your information safe?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  We aim to protect your personal information through a system of organizational and technical security measures.
                        </i>
                        <p>
                          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-11">
                    <div className={classes.hero}>
                      <div>
                        <h3>What are your privacy rights?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  You may review, change, or terminate your account at any time.
                        </i>
                        <p>
                        If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: <a href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</a>.
                        </p>
                        <p>
                          If you are resident in Switzerland, the contact details for the data protection authorities are available here: <a href="https://www.edoeb.admin.ch/edoeb/en/home.html">https://www.edoeb.admin.ch/edoeb/en/home.html</a>.
                        </p>
                        <p>
                          Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt-out of interest-based advertising by advertisers on our Services visit <a href="http://www.aboutads.info/choices/">http://www.aboutads.info/choices/</a>
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-12">
                    <div className={classes.hero}>
                      <div>
                        <h3>Controls for do-not-track features</h3>
                      </div>
                      <hr />
                      <div>
                        <p>
                          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-13">
                    <div className={classes.hero}>
                      <div>
                        <h3>Do California residents have specific privacy rights?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>In Short:  Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</i>
                        <p>California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>
                        <p>
                          If you are under 18 years of age, reside in California, and have a registered account with a Service, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g. backups, etc.).  
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-14">
                    <div className={classes.hero}>
                      <div>
                        <h3>Do we make updates to this notice?</h3>
                      </div>
                      <hr />
                      <div>
                        <i>
                          In Short:  Yes, we will update this notice as necessary to stay compliant with relevant laws.
                        </i>
                        <p>
                          We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
                        </p>
                      </div>
                    </div>
                  </section>
                  <section id="section-15">
                    <div className={classes.hero}>
                      <div>
                        <h3>How can you contact us about this notice?</h3>
                      </div>
                      <hr />
                      <div style={{paddingBottom: 300}}>
                        <p>
                          If you have any questions about these Terms and Conditions, You can contact us:
                        </p>
                        <p>
                          Email us at: <a href="mailto: nathan@d.buzz">nathan@d.buzz</a><br />
                          D.Buzz <br />
                          Arkansas, United States 
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

export default PrivacyPolicy