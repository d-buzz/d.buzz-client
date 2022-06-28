import React, { useState, useEffect } from 'react'
import { CloseIcon, ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Container } from 'react-bootstrap'

const useStyles = createUseStyles(theme => ({
  button: {
    fontSize: 15,
    height: 35,
    marginTop: -42,
  },
  appBanner: {
    margin: '0 auto',
    border: theme.border.primary,
    height: 55,
    '& svg': {
      '& path': {
        fill: '#000000',
      },
    },
  },
}))

const IconButton = React.lazy(() => import('@material-ui/core/IconButton'))

const InstallAppBanner = () => {
  const classes = useStyles()
  const [isVisible, setVisibleState] = useState(false)
  const [prompt, setState] = useState(null)
  const hide = () => setVisibleState(false)

  const promptToInstall = () => {
    if (prompt) return prompt.prompt()
    return Promise.reject(new Error('Tried installing before browser sent "beforeinstallprompt" event'))
  }

  useEffect(() => {
    const ready = (e) => {
      e.preventDefault()
      setState(e)
    }
    window.addEventListener("beforeinstallprompt", ready)
    return () => { window.removeEventListener("beforeinstallprompt", ready) }
  }, [])

  useEffect(() => { if (prompt) setVisibleState(true) }, [prompt])

  useEffect(() => {
    const installed = () => { setVisibleState(false) }
    window.addEventListener("appinstalled", installed)
    return () => { window.removeEventListener("appinstalled", installed) }
  }, [])

  if (!isVisible) return (<Container />)

  return (
    <React.Fragment>
      <Container className={classes.appBanner} onClick={hide} fluid={true}>
        <IconButton onClick={hide} size="small" style={{padding: 15}}>
          <CloseIcon />
        </IconButton>
        <center>
          <ContainedButton onClick={promptToInstall} fontSize={15} label={'Install D.Buzz | Micro-blogging for HIVE'} className={classes.button} />
        </center>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps)(InstallAppBanner)
