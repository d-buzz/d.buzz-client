import React from 'react'
import MetaMaskIcon from 'components/elements/Icons/MetaMaskIcon'
import { createUseStyles } from 'react-jss'

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
    color: theme.font.color,
    transition: 'all 250ms',
    background: '#f7e2cd',
    
    '&:hover': {
      background: '#f7dbbd',
    },

    '& .label': {
      display: 'grid',
      placeItems: 'center',
      width: '100%',
      fontSize: '1.2em',
      fontWeight: 600,
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

const LoginWithMetaMaskButton = (props) => {

  const classes = useStyles()

  return (
    <button className={classes.metaMaskButtonContainer} {...props}>
      <span className={classes.newLabel}>new</span>
      <MetaMaskIcon height={35}/>
      <span className="label">Login with MetaMask</span>
    </button>
  )
}

export default LoginWithMetaMaskButton