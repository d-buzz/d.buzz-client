import React from 'react'
import { createUseStyles } from 'react-jss'
import HiveIcon from 'components/elements/Icons/HiveIcon'

const useStyles = createUseStyles(theme => ({
  metaMaskButtonContainer: {
    position: 'relative',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 280,
    height: 'fit-content',
    border: 'none',
    padding: '5px 15px',
    borderRadius: 10,
    color: '#000000',
    transition: 'background 250ms',
    background: 'rgba(220, 53, 69, 0.2)',
    cursor: 'pointer',
    userSelect: 'none',
    
    '&:hover': {
      background: 'rgba(220, 53, 69, 0.25)',
    },
    
    '& .label': {
      display: 'grid',
      placeItems: 'center',
      width: '100%',
      fontSize: '1.2em',
      fontWeight: 600,
      color: theme.font.color,
    },
    
    '&:disabled': {
      opacity: 0.5,
      background: '#f7e2cd',
      cursor: 'not-allowed',
    },
  },
                                            
  newLabel: {
    width: 40,
    height: 'fit-cntent',
    position: 'absolute',
    top: -10,
    right: -10,
    background: '#e53935',
    color: '#ffffff',
    borderRadius: 50,
    fontSize: 14,
  },
  
}))

const HiveButton = (props) => {

  const classes = useStyles()

  return (
    <button className={classes.metaMaskButtonContainer} {...props}>
      <HiveIcon height={35}/>
      <span className="label">{props.title}</span>
    </button>
  )
}

export default HiveButton