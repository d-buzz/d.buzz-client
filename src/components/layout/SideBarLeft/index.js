import React from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import NavLink from 'react-bootstrap/NavLink'
import { BrandIcon } from 'components'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  items: {
    fontFamily: 'Roboto, sans-serif',
    color: 'black',
    fontSize: 20,
  },

})

const LinkContainer = ({ children, className }) => {
  return (
    <div style={{ width: 'auto' }}>
      <div style={{ marginLeft: 10 }}>
        { children }
      </div>
    </div>
  )
}

const SideBarLeft = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Nav defaultActiveKey="/home" className="flex-column">
        <LinkContainer >
          <NavbarBrand href="#">
            <div style={{ marginLeft: 15, marginRight: 15 }}>
              <BrandIcon />
            </div>
          </NavbarBrand>
          <div style={{ marginTop: 20 }}> 
            <NavLink className={classes.items}>
              Home
            </NavLink>
          </div>
        </LinkContainer>
      </Nav>
    </React.Fragment>
  )
}

export default SideBarLeft