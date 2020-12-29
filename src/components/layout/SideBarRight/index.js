import React from 'react'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import {
  ListGroup,
  ListAction,
  ListLink,
  Spinner,
} from 'components/elements'
import { SearchField } from 'components'
import { useLocation, Link } from 'react-router-dom'

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
    },
  },
  inner: {
    width: '95%',
    margin: '0 auto',
    whiteSpace: 'nowrap !important',
  },
  searchTips: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    '& span': {
      color: '#d32f2f',
      fontWeight: 400,
    },
  },
})

const SideBarRight = (props) => {
  const { user, items, loading, hideSearchBar = false } = props
  const classes = useStyles()
  const location = useLocation()
  const { pathname } = location
  let isInSearchRoute = false
  const { is_authenticated } = user

  if(pathname.match(/(\/search?)/)) {
    isInSearchRoute = true
  }

  const linkGenerator = (tag) => {
    let link = ''

    if(!is_authenticated) {
      link = '/ug'
    }

    link += `/tags?q=${tag}`

    return link
  }

  const SocialMediaLinks = [
    {
      name: 'Discord',
      label: 'dbuzzAPP',
      imagePath: `${window.location.origin}/discord.png`,
      url: 'https://discord.gg/kCZGPs7',
    },
    // {
    //   name: 'Facebook',
    //   label: 'dbuzzAPP',
    //   imagePath: `${window.location.origin}/facebook.png`,
    //   url: 'https://www.facebook.com/dbuzzapp/',
    // },
    // {
    //   name: 'Twitter',
    //   label: 'dbuzzAPP',
    //   imagePath: `${window.location.origin}/twitter.png`,
    //   url: 'https://twitter.com/dbuzzAPP',
    // },
  ]

  return (
    <React.Fragment>
      {!hideSearchBar && !isInSearchRoute && (<SearchField />)}
      <div style={{ paddingTop: 5 }}>
        <ListGroup label="Trends for you">
          {items.slice(0, 5).map((item) => (
            <ListAction href={linkGenerator(item.name)} key={`${item.name}-trend`} label={`#${item.name}`} subLabel={`${item.comments + item.top_posts} Buzz's`} />
          ))}
          <Spinner size={50} loading={loading} />
        </ListGroup>
      </div>
      <div style={{ paddingTop: 15 }}>
        <ListGroup label="Catch us on">
          {SocialMediaLinks.map((item) => (
            <ListLink key={`${item.name}-links`} title={item.name} label={`@${item.label}`} imagePath={item.imagePath} href={item.url} />
          ))}
        </ListGroup>
      </div>
      <div className={classes.footer}>
        <div className={classes.inner}>
          <Link to="/org/en/tos">Terms</Link>
          <Link to="/org/en/privacy">Privacy Policy</Link>
          <Link to="/org/en/disclaimer">Disclaimer</Link>
          <a href="/terms">About</a> <br/ >
          <Link to="/org/en/developers">Developers</Link>
          <label>&copy; Dataloft, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'GET_TRENDING_TAGS_REQUEST'),
  items: state.posts.get('tags'),
})

export default connect(mapStateToProps)(SideBarRight)
