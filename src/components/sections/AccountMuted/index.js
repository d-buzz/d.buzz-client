import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { createUseStyles } from 'react-jss'
import {
  getAccountListRequest,
} from 'store/profile/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { anchorTop } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import { ProfileSkeleton, HelmetGenerator, SearchListsField } from 'components'

const useStyles = createUseStyles(theme => ({
  spacer: {
    width: '100%',
    height: 5,
  },
  descriptionContainer: {
    borderBottom: theme.border.primary,
    ...theme.font,
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      ...theme.font,
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
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
}))

const AccountMuted = (props) => {
  const {
    match,
    loading,
    route,
    getAccountListRequest,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const classes = useStyles()
  const [index, setIndex] = useState(0)
  const [listType, setListType] = useState('mute')
  const [searchButtonLabel, setSearchButtonLabel] = useState('Mute')
  const { params } = match
  const { username } = params

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    let tab = 'users'
    if(index === 0) {
      tab = 'users'
    }else if (index === 1) {
      tab = 'followed'
    }
    history.push(`/@${username}/lists/muted/${tab}`)
  }

  useEffect(() => {
    anchorTop()
    getAccountListRequest(username,'muted')
    getAccountListRequest(username,'follow_muted')
    // eslint-disable-next-line
  }, [username])

  useEffect(() => {
    if(pathname.match(/\/lists\/muted\/users/g)) {
      setIndex(0)
      setListType('muted')
      setSearchButtonLabel('Mute')
    } else if(pathname.match((/\/lists\/muted\/followed/g))) {
      setIndex(1)
      setListType('follow_muted')
      setSearchButtonLabel('Follow muted list')
    } else {
      setIndex(0)
    }
  }, [pathname])

  return (
    <React.Fragment>
      <HelmetGenerator page='Profile' />
      <ProfileSkeleton loading={loading} />
      <div style={{ width: '100%', height: 'max-content' }} className={classes.descriptionContainer}>
        <div className={classes.spacer} />
        <SearchListsField buttonLabel={searchButtonLabel} listType={listType}/>
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={onChange}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Muted Users" />
          <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="Followed Muted Lists" />
        </Tabs>
      </div>
      <React.Fragment>
        {renderRoutes(route.routes, { author: username })}
      </React.Fragment>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_PROFILE_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountListRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountMuted)
