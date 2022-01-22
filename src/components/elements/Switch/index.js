import React, { useState } from "react"
import { createUseStyles } from 'react-jss'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

const useStyles = createUseStyles({
  container: {
    minWidth: 60,
    width: props => props.size >= 25 && props.size*2+5,
    height: props => props.size >= 25 ? props.size : 25,
    transform: 'scale(0.88)',
  },
  track: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
    background: '#e74b5d',
    boxShadow: '0 0 0 3px #e74b5d',
    borderRadius: props => props.size >= 25 ? props.size : 25,
    cursor: 'pointer',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    width: props => props.size >= 25 ? props.size : 25,
    height: '100%',
    borderRadius: '50%',
    background: 'white',
    transition: 'left 180ms',
  },
  icon: {
    display: 'flex',
    flex: 0.5,
    justifySelf: 'center',
    color: '#ffffff',
    padding: 2,
  },
})

function Switch({...props}) {

  if(props.size < 25){
    console.warn('Please enter Switch size greater than 20px to increase its actual size.')
  }

  const classes = useStyles(props)

  const [status, setStatus] = useState(props.state)

  const switchStyle = {left: !status ? 0 : `calc(100% - ${props.size >= 25 ? props.size : 25}px)`, right: status && 0}

  const handleSwitch = () => {
    if(!status){
      setStatus(true)
      props.onChange && props.onChange(true)
    } else {
      setStatus(false)
      props.onChange && props.onChange(false)

    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.track} onClick={handleSwitch}>
        <VisibilityIcon size={props.size >= 25 ? props.size/1.5 : 25} className={classes.icon}/>
        <VisibilityOffIcon size={props.size >= 25 ? props.size/1.5 : 25} className={classes.icon}/>
        <div className={classes.thumb} style={{...switchStyle}}></div>
      </div>
    </div>
  )
}

export default Switch
