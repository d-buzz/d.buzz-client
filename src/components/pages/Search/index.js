import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { searchRequest } from 'store/posts/actions'
import { anchorTop } from 'services/helper'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'

const useStyles = createUseStyles({
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      backgroundColor: '#ffebee',
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
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    }
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    }
  },
  weblink: {
    color: '#d32f2f'
  },
  topContainer: {
    borderBottom: '1px solid #e6ecf0',
    '& label': {
      fontFamily: 'Segoe-Bold',
      paddingTop: 5,
      '& span': {
        color: '#d32f2f',
        fontWeight: 400,
      },
    }
  },
})

const Search = (props) => {
  const [index, setIndex] = useState(0)
  const classes = useStyles()
  const { searchRequest } = props
  const location = useLocation()
  const params = queryString.parse(location.search)

  useEffect(() => {
    anchorTop()
    searchRequest(params.q)
  // eslint-disable-next-line
  }, [])

  const onChange = (e, index) => {
    setIndex(index)
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
          <Tab disableTouchRipple className={classes.tabs} label="Buzz's" />
          <Tab disableTouchRipple className={classes.tabs} label="People" />
        </Tabs>
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    searchRequest,
  }, dispatch)
})

export default connect(null, mapDispatchToProps)(Search)
