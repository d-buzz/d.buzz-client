import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer, Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import { BackArrowIcon, IconButton } from 'components/elements'
import { SideBarLeft, SideBarRight } from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory } from 'react-router-dom'
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
  nav: {
    borderBottom: '1px solid #e6ecf0',
    backgroundColor: 'white',
    zIndex: 100,
  }
})

const AppFrame = (props) => {
  const classes = useStyles()
  const { route } = props
  const { pathname } = useLocation()
  const history = useHistory()

  let title = 'Home'

  if(pathname.includes('/content/@')) {
    title = 'BUZZ'
  } else if(pathname.includes('/trending')) {
    title = 'Trending'
  } else if(pathname.includes('/latest')) {
    title = 'Latest'
  }

  const handleClickBackButton = () => {
    history.goBack()
  }

  return(
    <Container>
       <StickyContainer>
         <Row>
          <Col xs={2}>
            <Sticky>
              {
                ({ style }) => (
                  <div style={style}>
                    <SideBarLeft/>
                  </div>
                )
              }
            </Sticky>
          </Col>
          <Col xs={7}>
            <div className={classes.main}>
              <Sticky>
              {
                ({ style }) => (
                  <Navbar style={{ ...style,  }} className={classes.nav} expand="lg">
                    <Navbar.Brand href="#" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {
                        title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                          <IconButton onClick={handleClickBackButton} style={{ display: 'inline-block' }} icon={<BackArrowIcon />} />
                        )
                      }
                      <span style={{ display: 'inline-block', marginLeft: 5, }}>{ title }</span>
                    </Navbar.Brand>
                  </Navbar>
                )
              }
              </Sticky>
              { renderRoutes(route.routes) }
            </div>
          </Col>
          <Col xs={3}>
            <Sticky>
              {
                ({ style }) => (
                  <div style={style}>
                    <SideBarRight />
                  </div>
                )
              }
            </Sticky>
          </Col>
        </Row>
      </StickyContainer>
    </Container>
  )
}

export default AppFrame
