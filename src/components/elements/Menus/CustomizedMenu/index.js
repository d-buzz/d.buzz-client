import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#e61c34',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)

const CustomizedMenu = (props) => {
  const {
    anchorEl,
    handleClose,
    items,
  } = props

  return (
    <React.Fragment>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items.map((item) => (
          <React.Fragment>
            <StyledMenuItem onClick={item.onClick}>
              {item.icon && (
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>)}
              <ListItemText primary={item.label}/>
            </StyledMenuItem>
          </React.Fragment>
        ))}
      </StyledMenu>
    </React.Fragment>
  )
}

export default CustomizedMenu
