import React from 'react'
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
})

const SideBarRight = (props) => {
  const { items, loading, hideSearchBar = false, top = 0 } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      {
        !hideSearchBar && (
          <RoundedField
            icon={<SearchIcon top={-2} />}
            placeholder="Search D.Buzz"
            className={classes.search}
          />
        )
      }
      <div style={{ marginTop: top }}>
        <ListGroup label="Trends for you">
          {
            items.slice(0, 5).map((item) => (
              <ListAction label={`#${item.name}`} subLabel={`${item.comments + item.top_posts} Buzz's`} />
            ))
          }
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
