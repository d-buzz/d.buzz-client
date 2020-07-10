import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  blue: {
    backgroundColor: 'blue'
  },
  red: {
    backgroundColor: 'red',
    height: '100vh',
  }
})

const Home = (props) => {
  const classes = useStyles()
  
  return (
    <React.Fragment>
      <Container className={classes.container}>
        <Row>
          <Col className={classes.blue} xs={3}>1 of 3</Col>
          <Col className={classes.red} xs={6}>2 of 3 (wider)</Col>
          <Col className={classes.blue}>3 of 3</Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default Home
