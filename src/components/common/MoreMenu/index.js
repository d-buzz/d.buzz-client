import React, { useState, useEffect } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const MoreMenu = (props) => {
  const {
    open,
    onClose,
    anchor,
    items,
    className,
    themeModal,
    switchUserModal,
  } = props

  const [callFunc, setcallFunc] = useState()

  const setOverflow = (value) => {
    document.querySelector('body').style.overflowY = value
  }

  const handleMenuClosing = (onClick) => () => {
    onClose()
    setcallFunc(onClick)
    setOverflow('scroll')
  }
 
  useEffect(() => {
    console.log(open, themeModal, switchUserModal)
    setcallFunc(callFunc)
    if(!open && !themeModal && !switchUserModal){
      setOverflow('scroll')
      // eslint-disable-next-line
    } else if(!open && themeModal || switchUserModal){
      setOverflow('hidden')
    }
    // eslint-disable-next-line
  }, [open, themeModal, switchUserModal])

  return (
    <Menu
      style={{ zIndex: 3500 }}
      anchorEl={() => anchor.current}
      open={open}
      onClose={onClose}
      className={className}
      transformOrigin={{vertical: 'bottom', horizontal: 'top'}}
    >
      {items.map(({onClick, text}) => (
        <MenuItem onClick={handleMenuClosing(onClick)}>{text}</MenuItem>
      ))}
    </Menu>
  )
}

export default MoreMenu