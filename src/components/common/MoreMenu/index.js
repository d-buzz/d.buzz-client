import React, { useState, useEffect } from 'react'
import Menu from '@material-ui/core/Menu'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'

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

  const handleClickCollapse = (onClick) => () => {
    setcallFunc(onClick)
  }
 

  const handleClickCollapse = (onClick) => () => {
    setcallFunc(onClick)
  }

  useEffect(() => {
    // console.log(open, themeModal, switchUserModal)
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
      transformOrigin={{vertical: 'top', horizontal: 'top'}}
      transformOrigin={{vertical: 'top', horizontal: 'top'}}
    >
      <List
        component="nav"
        aria-labelledby="advanced-subheader"
        subheader={<ListSubheader component="div" id="advanced-subheader" style={{ fontSize: '20px !important', fontWeight: '700 !important' }}>
              Advanced
        </ListSubheader>}
        style={{
          maxHeight: '400px', // Adjust this value based on your needs
          overflowY: 'auto', // This makes the list scrollable
        }}
      >
        <Divider />
        {items.map(({onClick, text, visible, subItems, collapse}) => (
          visible &&
            (
              Object.keys(subItems).length > 0 ? (
                <>
                  <ListItem button onClick={handleClickCollapse(onClick)}>
                    {/* <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon> */}
                    <ListItemText primary={text}/>
                    {collapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={collapse} timeout="auto" unmountOnExit>
                    {subItems.map(({subonClick, subtext, subhref}) => (
                      subhref === '' ?
                        <List component="div">
                          <ListItem onClick={handleMenuClosing(subonClick)} key={text} button>
                            {/* <ListItemIcon>
                            <StarBorder />
                          </ListItemIcon> */}
                            <ListItemText primary={subtext} />
                          </ListItem>
                        </List>
                        :
                        <List component="div">
                          <ListItem component="a" href={subhref} target="_blank" rel="noopener noreferrer" key={text} button>
                            {/* <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon> */}
                            <ListItemText primary={subtext} />
                          </ListItem>
                        </List>

                    ))}
                  </Collapse>
                </>
              )
                :
                <ListItem button>
                  {/* <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon> */}
                  <ListItemText onClick={handleMenuClosing(onClick)} key={text} primary={text} />
                </ListItem>
            )
        ))}
      </List>
    </Menu>
  )
}

export default MoreMenu