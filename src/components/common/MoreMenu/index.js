import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const MoreMenu = (props) => {
  const {
    open,
    onClose,
    anchor,
    items,
    className,
  } = props

  return (
    <Menu
      anchorEl={() => anchor.current}
      open={open}
      onClose={onClose}
      className={className}
      transformOrigin={{vertical: 'bottom', horizontal: 'top'}}
    >
      {items.map(({onClick, text}) => (
        <MenuItem onClick={onClick}>{text}</MenuItem>
      ))}
    </Menu>
  )
}

export default MoreMenu