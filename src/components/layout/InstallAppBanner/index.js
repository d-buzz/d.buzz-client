import React, { useState, useEffect } from 'react'
import { BuzzIcon, CloseIcon } from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import FormLabel from 'react-bootstrap/FormLabel'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  label: {
    fontSize: 15,
    height: 35,
  },
  container: {
    margin: '0 auto',
    '@media (min-width: 1100px)': {
      '&.container': {
        maxWidth: '900px',
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

  if (!isVisible) return (<div />)

  return (
    <div className={classes.container} onClick={promptToInstall}>
      <IconButton style={{ marginTop: -5 }} onClick={hide} size="small">
        <CloseIcon />
      </IconButton>
      <BuzzIcon />
      <FormLabel className={classes.label}>Install D.Buzz | Micro-blogging for HIVE</FormLabel>
    </div>
  )
}

export default InstallAppBanner
