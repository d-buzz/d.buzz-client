import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { BrandIcon } from 'components/elements'
import { renderRoutes } from 'react-router-config'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  nav: {
    marginTop: 10,
    borderBottom: '5px solid #e4e4e4',
    width: '100%',
  },
})

const DeveloperFrame = (props) => {
  const classes = useStyles()

  const { route } = props

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Navbar.Brand className={classes.nav}>
          <Link to="/"><BrandIcon height={30} top={-15} /></Link>
        </Navbar.Brand>
        {renderRoutes(route.routes)}
      </Container>
    </React.Fragment>
  )
}

export default DeveloperFrame
