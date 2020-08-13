import React from 'react'
import Skeleton from 'react-loading-skeleton'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'

const useStyles = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    borderBottom: '1px solid #e6ecf0',
    overflow: 'hidden',
    '& a': {
      color: 'black',
    },
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
    paddingBottom: 0,
    marginBottom: 0,
  },
  username: {
    color: '#657786',
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
    '& a': {
      color: '#d32f2f',
    },
    '&:after': {
      content: '',
      clear: 'both',
      display: 'table',
    },
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
  link: {
    color: 'black !important',
    '&:hover': {
      color: 'black',
      textDecoration: 'underline !important',
    },
  },
})

const ReplylistSkeleton = ({ loading }) => {
  const classes = useStyles()

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
                      <div style={{ margin: '0 auto', width: 2, backgroundColor: '#eee', backgroundImage: 'linear-gradient( 90deg,#eee,#f5f5f5,#eee )', height: '100%', flexGrow: 1, }} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <Link
                          className={classes.link}
                        >
                          <p className={classes.name}>
                            <Skeleton height={10} width={120} />
                          </p>
                        </Link>
                        <label className={classes.username}>
                            <Skeleton height={10} width={120} />
                        </label>
                        <Skeleton count={2} height={10} />
                        <Skeleton height={150} />
                        <Skeleton width={300} height={10} />
                        <Skeleton width={550} height={10} top={10} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
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
                        <Link
                          className={classes.link}
                        >
                          <p className={classes.name}>
                            <Skeleton height={10} width={120} />
                          </p>
                        </Link>
                        <label className={classes.username}>
                          <Skeleton height={10} width={120} />
                        </label>
                      </div>
                      <Skeleton width={350} height={10} />
                      <Skeleton width={650} height={10} top={10} />
                      <Skeleton count={3} height={10} />
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
                        <Link
                          className={classes.link}
                        >
                          <p className={classes.name}>
                            <Skeleton height={10} width={120} />
                          </p>
                        </Link>
                        <label className={classes.username}>
                          <Skeleton height={10} width={120} />
                        </label>
                      </div>
                      <Skeleton count={3} height={10} />
                      <Skeleton width={350} height={10} />
                      <Skeleton width={650} height={10} top={10} />
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

export default ReplylistSkeleton
