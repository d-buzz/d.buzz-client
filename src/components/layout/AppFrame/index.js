import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer, Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SideBarLeft, SideBarRight } from 'components'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  main: {
    height: '100%', 
    borderLeft: '1px solid #c1bfbf', 
    borderRight: '1px solid #c1bfbf'
  },
  inner: {
    widht: '98%',
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
          <Col lg={3} md>
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
          <Col xs={6}>
            <div className={classes.main}>
              <div className={classes.inner}>
                { children }
              </div>
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
