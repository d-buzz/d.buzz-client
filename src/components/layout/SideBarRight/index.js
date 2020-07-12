import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { createUseStyles } from 'react-jss'
import { RoundedField } from 'components/elements'


const useStyles = createUseStyles({
  search: {
    marginBottom: 5,
    marginTop: 5,
  }
})

const SideBarRight = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <RoundedField placeholder="Search D.Buzz" className={classes.search} />
      <br />
      <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
      <br />
      <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  )
}

export default SideBarRight