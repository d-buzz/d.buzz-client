import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { createUseStyles } from 'react-jss'
import { Avatar, ContainedButton } from 'components/elements'

const useStyles = createUseStyles({
  cover: {
    height: 270,
    width: '100%',
    backgroundColor: '#ffebee',
    overFlow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      overFlow: 'hidden',
    }
  },
  avatar: {
    marginTop: -70,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
    marginRight: 15,
  },
  fullName: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 0,
  },
  userName: {
    fontSize: 16,
    padding: 0,
    marginTop: -20,
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content'
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  descriptionContainer: {
    borderBottom: '1px solid #e6ecf0',
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      backgroundColor: '#ffebee',
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      fontWeight: 'bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    }
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    }
  },
  weblink: {
    color: '#d32f2f'
  }
})


const Profile = () => {
  const classes = useStyles()
  const [index, setIndex] = useState(0)

  const onChange = (e, index) => {
    setIndex(index)
  }

  return (
    <React.Fragment>
      <div className={classes.cover}>
        <img src="https://images.hive.blog/0x0/https://cdn.steemitimages.com/DQmZDkfaVoq6Tb6qvghhwT8iFmWSLPBRMmZukLQcFxEGx3v/Philippines.jpg" alt="cover"/>
      </div>
      <div className={classes.wrapper}>
        <Row>
          <Col xs="auto">
            <div className={classes.avatar}>
              <Avatar border={true} height="135" author="chrisrice" size="medium" />
            </div>
          </Col>
          <Col>
            <ContainedButton
              className={classes.walletButton}
              transparent={true}
              label="View wallet"
            />
          </Col>
        </Row>
      </div>
      <div style={{ width: '100%', height: 'max-content' }} className={classes.descriptionContainer}>
        <div className={classNames(classes.wrapper)}>
          <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
            <Col xs="auto">
              <p className={classNames(classes.paragraph, classes.fullName)}>Chris Rice</p>
              <p className={classNames(classes.paragraph, classes.userName)}>@chrisrice</p>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <p className={classes.paragraph}>Coordinator for D.Buzz | Author at ChrisRice.blog | To Prevent, Reduce & Eliminate Suffering</p>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <p className={classes.paragraph}>
                <a href="/" className={classes.weblink}>https://d.buzz</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <p className={classes.paragraph}>
                <b>619</b> Following &nbsp; <b>357</b> Follower
              </p>
            </Col>
          </Row>
          <div className={classes.spacer} />
          <Tabs
            value={index}
            indicatorColor="primary"
            textColor="primary"
            centered
            onChange={onChange}
            className={classes.tabContainer}
          >
            <Tab disableTouchRipple className={classes.tabs} label="Buzzes" />
            <Tab disableTouchRipple className={classes.tabs} label="Replies" />
            <Tab disableTouchRipple className={classes.tabs} label="Followers" />
            <Tab disableTouchRipple className={classes.tabs}label="Following" />
          </Tabs>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Profile
