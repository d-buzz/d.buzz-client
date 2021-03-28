import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import {
  searchRequest,
  setPageFrom,
} from 'store/posts/actions'
import { anchorTop } from 'services/helper'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { renderRoutes } from 'react-router-config'
import { bindActionCreators } from 'redux'
import { useHistory, useLocation } from 'react-router-dom'

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

const Search = (props) => {
  const [index, setIndex] = useState(0)
  const classes = useStyles()
  const { searchRequest, setPageFrom, route, user } = props
  const location = useLocation()
  const { pathname } = location
  const params = queryString.parse(location.search)
  const query = params.q !== undefined ? params.q : ''
  const history = useHistory()

  useEffect(() => {
    anchorTop()
    searchRequest(query)
    setPageFrom(null)
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(pathname.match(/(\/search\/posts)/m)) {
      setIndex(0)
    } else if(pathname.match(/(\/search\/people)/m)) {
      setIndex(1)
    }
  }, [pathname])

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    let tab = 'posts'

    if(index === 1) {
      tab = 'people'
    }

    const { is_authenticated } = user

    if(is_authenticated) {
      history.push(`/search/${tab}?q=${encodeURIComponent(params.q)}`)
    } else {
      history.push(`/ug/search/${tab}?q=${encodeURIComponent(params.q)}`)
    }
  }

  return (
    <React.Fragment>
      <div className={classes.topContainer}>
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={onChange}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Buzz's" />
          <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="People" />
        </Tabs>
      </div>
      <React.Fragment>
        {renderRoutes(route.routes)}
      </React.Fragment>
    </React.Fragment>
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
