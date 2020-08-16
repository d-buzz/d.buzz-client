import React from 'react'
import Skeleton from 'react-loading-skeleton'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { createUseStyles } from 'react-jss'

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
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content'
  },
  avatar: {
    marginTop: -70,
  },
})

const ProfileSkeleton = ({ loading }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {loading && (
        <React.Fragment>
          <Skeleton height={270} />
          <div className={classes.wrapper}>
            <Row>
              <Col xs="auto">
                <div className={classes.avatar}>
                  <Skeleton circle={true} height={135} width={135} />
                </div>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>
                <Skeleton height={10} width={180} /> <br />
                <Skeleton height={10} width={160} />
              </Col>
            </Row>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ProfileSkeleton
