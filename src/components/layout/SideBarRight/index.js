import React, { useEffect, useState } from 'react'
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
import { getPrice } from 'services/api'
import ThemeProvider from 'components/wrappers/ThemeProvider'
const Skeleton = React.lazy(() => import('react-loading-skeleton'))

const useStyles = createUseStyles(theme => ({
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

  coinPriceChart: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.right.list.background,
    borderRadius: 10,
    padding: 15,
  },
  
  priceItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 'fit-content',
    margin: '5px 0',

    
    '& .price_container': {
      display: 'flex',
      alignItems: 'flex-start',
      
      '& .market': {
        display: 'flex',
        alignItems: 'center',
        flex: 0.2,
        color: theme.font.color,
        fontSize: 18,
        fontWeight: 800,
        margin: 0,
        marginRight: 15,
      },
      '& .price': {
        flex: 0.8,
        color: theme.font.color,
        fontSize: 18,
        fontWeight: 800,
        margin: 0,
      },
    },
    
    '& .price_description': {
      margin: 0,
      fontSize: 13,
      color: '#657786',
      '& a': {
        color: '#657786',
      },
    },
  },
}))

const SideBarRight = (props) => {
  const { user, items, loading, hideSearchBar = false } = props
  const classes = useStyles()
  const location = useLocation()
  const { pathname } = location
  let isInSearchRoute = false
  const { is_authenticated } = user
  const [hivePrice, setHivePrice] = useState(0)
  const [hbdPrice, setHbdPrice] = useState(0)
  
  if (pathname.match(/(\/search?)/)) {
    isInSearchRoute = true
  }

  const linkGenerator = (tag) => {
    let link = ''

    if (!is_authenticated) {
      link = '/ug'
    }

    link += `/tags?q=${tag}`

    return link
  }

  const SocialMediaLinks = [
    {
      name: 'Discord',
      label: '@dbuzzAPP',
      imagePath: `${window.location.origin}/discord.svg`,
      url: 'https://discord.gg/kCZGPs7',
    },
    {
      name: 'Element',
      label: '#d.buzz:matrix.org',
      imagePath: `${window.location.origin}/element.svg`,
      url: 'https://matrix.to/#/#d.buzz:matrix.org',
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

  useEffect(() => {
    (async function resources() {

      const hivePrice = await getPrice('hive')
      const hbdPrice = await getPrice('hbd')

      setHivePrice(`$${hivePrice.hive.usd.toFixed(3)}`)
      setHbdPrice(`$${hbdPrice.hive_dollar.usd.toFixed(3)}`)
    })()
  }, [])

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
      <div className={classes.coinPriceChart}>
        <span className={classes.priceItem}>
          <span className='price_container'>
            <label className='market'>HIVE</label>
            {hivePrice ?
              <label className='price'>{hivePrice}</label> :
              <ThemeProvider>
                <Skeleton height={20} width={50} count={1}/>
              </ThemeProvider>}
          </span>
          <label className='price_description'> HIVE Market Value by <a href='https://www.coingecko.com/en/coins/hive'>@CoinGecko</a></label>
        </span>
        <span className={classes.priceItem}>
          <span className='price_container'>
            <label className='market'>HBD</label>
            {hbdPrice ?
              <label className='price'>{hbdPrice}</label> :
              <ThemeProvider>
                <Skeleton height={20} width={50} count={1}/>
              </ThemeProvider>}
          </span>
          <label className='price_description'> HBD Market Value by <a href='https://www.coingecko.com/en/coins/hive_dollar'>@CoinGecko</a></label>
        </span>
      </div>
      <div style={{ paddingTop: 5 }}>
        <ListGroup label="Catch us on">
          {SocialMediaLinks.map((item) => (
            <ListLink key={`${item.name}-links`} title={item.name} label={`${item.label}`} imagePath={item.imagePath} href={item.url} />
          ))}
        </ListGroup>
      </div>
      <div className={classes.footer}>
        <div className={classes.inner}>
          <Link to="/org/en/tos">Terms of Service</Link>
          <Link to="/org/en/privacy">Privacy Policy</Link>
          <Link to="/org/en/disclaimer">Disclaimer</Link>
          <br />
          <Link to="/org/en/getstarted">Get Started</Link>
          <Link to="/developers">Developers</Link>
          <br />
          <label>&copy; {new Date().getFullYear()} Dataloft, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
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
