import React, {useState, useEffect} from 'react'
import {Tabs, Tab} from '@material-ui/core'
import {connect} from 'react-redux'
import queryString from 'query-string'
import {renderRoutes} from 'react-router-config'
import {bindActionCreators} from 'redux'
import {useHistory, useLocation} from 'react-router-dom'
import {searchRequest, setPageFrom} from 'store/posts/actions'
import {anchorTop} from 'services/helper'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles(theme => ({
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      backgroundColor: {
        ...theme.textArea,
      },
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      fontFamily: 'Segoe-Bold',
      fontWeight: 'bold',
      ...theme.font,
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
  },
  weblink: {
    color: '#d32f2f',
  },
  topContainer: {
    borderBottom: theme.border.primary,
    '& label': {
      fontFamily: 'Segoe-Bold',
      paddingTop: 5,
      '& span': {
        color: '#d32f2f',
        fontWeight: 400,
      },
    },
  },
}))


const Search = ({searchRequest, setPageFrom, route, user}) => {
  const [index, setIndex] = useState(0)
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()
  const params = queryString.parse(location.search)
  const query = params.q || ''

  useEffect(() => {
    anchorTop()
    searchRequest(query)
    setPageFrom(null)
  }, [searchRequest, setPageFrom, query, location.pathname])

  useEffect(() => {
    if (location.pathname.includes('/search/latest')) {
      setIndex(1)
    } else if (location.pathname.includes('/search/people')) {
      setIndex(2)
    } else if (location.pathname.includes('/search/trending')) {
      setIndex(0)
    }
  }, [location.pathname])

  const handleTabs = (index) => {
    const tabsMapping = ['trending', 'latest', 'people']
    const tab = tabsMapping[index]
    const basePath = user.is_authenticated ? '/search' : '/ug/search'

    history.push(`${basePath}/${tab}?q=${encodeURIComponent(params.q)}`)
  }

  return (
    <>
      <div className={classes.topContainer}>
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={(e, newIndex) => handleTabs(newIndex)}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple className={classes.tabs} label="Trending"/>
          <Tab disableTouchRipple className={classes.tabs} label="Latest"/>
          <Tab disableTouchRipple className={classes.tabs} label="People"/>
        </Tabs>
      </div>
      {renderRoutes(route.routes)}
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    searchRequest,
    setPageFrom,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
