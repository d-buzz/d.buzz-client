import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { BrandIcon, BrandIconDark } from 'components/elements'
import { renderRoutes } from 'react-router-config'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'

const useStyles = createUseStyles({
  nav: {
    marginTop: 10,
    borderBottom: '5px solid #e4e4e4',
    width: '100%',
  },
})

const DeveloperFrame = (props) => {
  const classes = useStyles()

  const { route, theme } = props
  const { mode } = theme

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Navbar.Brand className={classes.nav}>
          <Link to="/">
            {mode === 'light' && (<BrandIcon height={30} top={-15} />)}
            {(mode === 'night' || mode === 'gray') && (<BrandIconDark height={30} top={-15} />)}
          </Link>
        </Navbar.Brand>
        {renderRoutes(route.routes)}
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps, {})(DeveloperFrame)
