import React, { useState, useEffect } from 'react'
import { CloseIcon, ContainedButton } from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import { createUseStyles } from 'react-jss'
import { Container } from 'react-bootstrap'

const useStyles = createUseStyles({
  button: {
    fontSize: 15,
    height: 35,
    marginTop: -25,
  },
  container: {
    margin: '0 auto',
    height: 55,
    '& svg': {
      '& path': {
        fill: '#000000',
      },
    },
  },
})

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

  if (!isVisible) return (<Container />)

  return (
    <React.Fragment>
      <Container className={classes.container} onClick={hide} fluid={true}>
        <IconButton onClick={hide} size="small" style={{paddingTop: 15}}>
          <CloseIcon />
        </IconButton>
        <center>
          <ContainedButton onClick={promptToInstall} fontSize={15} label={'Install D.Buzz | Micro-blogging for HIVE'} className={classes.button} />
        </center>
      </Container>
    </React.Fragment>
  )
}

export default InstallAppBanner
