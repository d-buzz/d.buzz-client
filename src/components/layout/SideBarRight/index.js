import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import {
  RoundedField,
  SearchIcon,
  ListGroup,
  ListAction,
  HashtagLoader,
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
  searchTips: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    '& span': {
      color: '#d32f2f',
      fontWeight: 400,
    }
  }
})

const SearchTips = ({ show, className }) => {
  return (
    <React.Fragment>
      {show && (
        <label className={className}>You can use <span>@username</span> or <span>#tags</span> to simplify your search</label>
      )}
    </React.Fragment>
  )
}


const SideBarRight = (props) => {
  const { items, loading, hideSearchBar = false } = props
  const [openTips, setOpenTips] = useState(false)
  const classes = useStyles()

  const onMouseEnter = () => {
    setOpenTips(true)
  }

  const onMouseLeave = () => {
    setOpenTips(false)
  }

  console.log({ openTips })

  return (
    <React.Fragment>
      {!hideSearchBar && (
        <React.Fragment>
          <RoundedField
            icon={<SearchIcon top={-2} />}
            placeholder="Search D.Buzz"
            className={classes.search}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <SearchTips show={openTips} className={classes.searchTips} />
        </React.Fragment>
      )}
      <div>
        <ListGroup label="Trends for you">
          {items.slice(0, 5).map((item) => (
            <ListAction href={`/tags?q=${item.name}`} key={`${item.name}-trend`} label={`#${item.name}`} subLabel={`${item.comments + item.top_posts} Buzz's`} />
          ))}
          <HashtagLoader loading={loading} />
        </ListGroup>
      </div>
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

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_TRENDING_TAGS_REQUEST'),
  items: state.posts.get('tags'),
})

export default connect(mapStateToProps)(SideBarRight)
