import React from 'react'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { 
  RoundedField,
  SearchIcon,
  ListGroup,
  ListAction, 
} from 'components/elements'

const useStyles = createUseStyles({
  search: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#e6ecf0',
  },
  footer: {
    width: '100%',
    marginTop: 15,
    '& a': {
      color: '#657786',
      fontSize: 14,
      marginRight: 10,
    },
    '& label': {
      color: '#657786',
      fontSize: 14,
    }
  },
  inner: {
    width: '95%',
    margin: '0 auto',
  },
})

const SideBarRight = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <RoundedField 
        icon={<SearchIcon top={-2} />} 
        placeholder="Search D.Buzz" 
        className={classes.search} 
      />
      <ListGroup label="Trends for you">
        <ListAction label="#AllLivesMatter" subLabel="3000 buzzes" />
        <ListAction label="#AwesomeHive" subLabel="2500 buzzes" />
        <ListAction label="#Earthquake" subLabel="1000 buzzes" />
        <ListAction label="#Postmortem" subLabel="800 buzzes" />
        <ListAction label="#RigorMortis" subLabel="800 buzzes" />
      </ListGroup>
      <div className={classes.footer}>
        <div className={classes.inner}>
          <a href="/terms">Terms</a>
          <a href="/terms">Privacy Policy</a>
          <a href="/terms">Cookies</a>
          <a href="/terms">About</a> <br/ >
          <label>&copy; D.Buzz, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SideBarRight