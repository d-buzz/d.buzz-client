import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { isMobile } from 'react-device-detect'
import { createUseStyles } from 'react-jss'
const Skeleton = React.lazy(() => import('react-loading-skeleton'))


const addHover = (theme) => {
  let style = {
    '&:hover': {
      ...theme.postList.hover,
    },
  }

  if(isMobile) {
    style = {}
  }

  return style
}

const useStyle = createUseStyles(theme => ({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    minHeight: 150,
    borderBottom: theme.border.primary,
    '& a': {
      color: 'black',
    },
    ...addHover(theme),
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
    },
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    },
  },
  paper: {
    pointerEvents: "auto",
    padding: 2,
    '& :after': {
      border: '1px solid red',
    },
  },
  button: {
    width: 85,
    height: 35,
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  skeleton: {
    color: 'red',
  },
}))

const PostlistSkeleton = ({ loading }) => {
  const classes = useStyle()

  return (
    <React.Fragment>
      {loading && (
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
                      <label className={classes.name}>
                        <Skeleton height={10} width={80} />
                      </label>
                      <div>
                        <Skeleton count={2} height={10} />
                      </div>
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
                      <label className={classes.name}>
                        <Skeleton height={10} width={80} />
                      </label>
                      <div>
                        <Skeleton count={1} height={10} />
                      </div>
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
                      <label className={classes.name}>
                        <Skeleton height={10} width={80} />
                      </label>
                      <div>
                        <Skeleton count={2} height={10} />
                      </div>
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
                      <label className={classes.name}>
                        <Skeleton height={10} width={80} />
                      </label>
                      <div>
                        <Skeleton count={2} height={10} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PostlistSkeleton
