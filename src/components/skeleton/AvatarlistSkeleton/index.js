import React from 'react'
import { createUseStyles } from 'react-jss'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Skeleton from 'react-loading-skeleton'

const useStyle = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
    cursor: 'pointer',
    '& label': {
      cusor: 'pointer',
    },
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e6ecf0',
    '& a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f5f8fa',
    },
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 50,
  },
  right: {
    height: 'max-content',
    width: '98%',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  username: {
    color: '#657786',
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  post: {
    color: '#14171a',
    paddingTop: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
    cursor: 'pointer',
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  preview: {
    '& a': {
      borderRadius: '10px 10px',
      boxShadow: 'none',
    }
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
})

const AvatarlistSkeleton = ({ loading }) => {
  const classes = useStyle()

  return (
    <React.Fragment>
      {
        loading && (
          <React.Fragment>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <div className={classes.left}>
                      <Skeleton circle={true} height={50} width={50} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <p className={classes.name}>
                          <Skeleton height={10} width={120} />
                        </p>
                        <p className={classes.username}>
                          <Skeleton height={10} width={200} />
                        </p>
                      </div>
                      <div className={classes.content}>
                        <label className={classes.username}>
                          <Skeleton height={10} width={120} />
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <div className={classes.left}>
                      <Skeleton circle={true} height={50} width={50} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <p className={classes.name}>
                          <Skeleton height={10} width={200} />
                        </p>
                        <p className={classes.username}>
                          <Skeleton height={10} width={120} />
                        </p>
                      </div>
                      <div className={classes.content}>
                        <label className={classes.username}>
                          <Skeleton height={10} width={170} />
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <div className={classes.left}>
                      <Skeleton circle={true} height={50} width={50} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <p className={classes.name}>
                          <Skeleton height={10} width={190} />
                        </p>
                        <p className={classes.username}>
                          <Skeleton height={10} width={220} />
                        </p>
                      </div>
                      <div className={classes.content}>
                        <label className={classes.username}>
                          <Skeleton height={10} width={170} />
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </React.Fragment>
        )
      }
    </React.Fragment>
  )
}

export default AvatarlistSkeleton
