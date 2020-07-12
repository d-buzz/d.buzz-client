import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer, Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import { SideBarLeft, SideBarRight } from 'components'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  main: {
    minHeight: '100vh', 
    borderLeft: '1px solid #e6ecf0', 
    borderRight: '1px solid #e6ecf0'
  },
  inner: {
    width: '98%',
    margin: '0 auto',
  }
})

const AppFrame = (props) => {
  const classes = useStyles()
  const { children } = props

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
                  <Navbar style={{ ...style, borderBottom: '1px solid #e6ecf0', backgroundColor: 'white' }} expand="lg">
                    <Container>
                      <Navbar.Brand href="#" style={{ fontFamily: 'Roboto, sans-serif' }}>Home</Navbar.Brand>
                    </Container>
                  </Navbar>
                )
              }
              </Sticky>
              { children }
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
