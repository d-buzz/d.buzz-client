import React from 'react'
import { SideBarRight } from 'components'
import { Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { createUseStyles } from 'react-jss'
import { renderRoutes } from 'react-router-config'

const useStyles = createUseStyles({
  main: {
    minHeight: '100vh',
    borderLeft: '1px solid #e6ecf0',
    borderRight: '1px solid #e6ecf0',
  },
  inner: {
    width: '98%',
    margin: '0 auto',
  },
  guardedContainer: {
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1300px',
      },
    },
  },
  unGuardedContainer: {
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1100px',
      },
    },
  },
  nav: {
    borderBottom: '1px solid #e6ecf0',
    borderLeft: '1px solid #e6ecf0',
    borderRight: '1px solid #e6ecf0',
    backgroundColor: 'white',
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
  },
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  },
  clearPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    display: 'inline-block',
    marginLeft: 5,
  }
})

const UnguardedAppFrame = (props) => {
  const { route } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Row>
        <Col xs={8} className={classes.clearPadding}>
          <div style={{ paddingTop: 60 }} className={classes.main}>
            <React.Fragment>
              { renderRoutes(route.routes) }
            </React.Fragment>
          </div>
        </Col>
        <Col xs={4}>
          <Sticky>
            {
              ({ style }) => (
                <div style={{ ...style, paddingTop: 60, }}>
                  <SideBarRight hideSearchBar={true} />
                </div>
              )
            }
          </Sticky>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default UnguardedAppFrame
