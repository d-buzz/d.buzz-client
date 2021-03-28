import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import {
  RoundedField,
  SearchIcon,
} from 'components/elements'
import { 
  MuteButton, 
  FollowMutedListButton, 
  BlacklistButton, 
  FollowBlacklistsButton,
} from "components"
import { connect } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { setAccountListSearchkey } from "store/profile/actions"
import { setAccountSearchListKeyword } from "store/interface/actions"
import { CircularProgress } from '@material-ui/core'
import { pending } from 'redux-saga-thunk'

const useStyles = createUseStyles(theme => ({
  search: {
    margin: 10,
    ...theme.search.background,
  },
  circle: {
    strokeLinecap: 'round',
    color: '#e53935',
  },
  searchError: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    color: theme.font.color,
    marginLeft: 15,
    '& span': {
      color: '#d32f2f',
      fontWeight: 400,
    },
  },
}))

const SearchError = ({ show, className }) => {
  return (
    <React.Fragment>
      {show && (
        <label className={className}>
          <span>Account is invalid or already on the list</span>
        </label>
      )}
    </React.Fragment>
  )
}


const SearchListsField = (props) => {
  const { 
    iconTop = -2, 
    defaultValue='',
    dispatch,
    loadingButton=false,
    buttonLabel,
    listType,
    search='',
    setAccountListSearchkey,
    setAccountSearchListKeyword,
    searchListButton,
    searchLoading,
    accountExist,
    ...otherProps
  } = props
  
  const [showError, setShowError] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const classes = useStyles()
  const buttonStyle = { float: 'right', marginTop: 13, marginRight: 10, marginLeft: -30 }

  useEffect(() => {
    setAccountSearchListKeyword(defaultValue)
  // eslint-disable-next-line
  }, [defaultValue])

  useEffect(() => {
    if(search){
      if(searchListButton && searchListButton.list_type !==null 
        && searchListButton.show === true){
        setShowButton(true)
      }else{
        setShowButton(false)
      }
    }else{
      setShowButton(false)
      setShowError(false)
    }
  }, [searchListButton, search])

  useEffect(() => {
    if(accountExist && accountExist.exists === false){
      setShowError(true)
    }else{
      setShowError(false)
    }
  }, [accountExist])


  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      setAccountListSearchkey(listType,search)
    }
  }

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    const val = value ? value.toLowerCase() : value
    setAccountSearchListKeyword(val)
    setShowButton(false)
    setShowError(false)
    if(!val){
      setAccountListSearchkey(listType,val)
    }
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <RoundedField
            value={search}
            icon={<SearchIcon top={iconTop} />}
            placeholder='Search users'
            className={classes.search}
            onKeyDown={handleSearchKey}
            onChange={onChange}
            {...otherProps}
          />
          {!searchLoading && search && <SearchError show={showError} className={classes.searchError} />}
        </Col>
        {(showButton || searchLoading) && 
        (<Col xs="auto">
          {!searchLoading && 
            <React.Fragment>
              {listType === 'muted' && (
                <MuteButton 
                  username={search} 
                  label={buttonLabel}
                  loading={loadingButton}
                  disabled={loadingButton}
                  style={buttonStyle}/> 
              )}
              {listType === 'follow_muted' && (
                <FollowMutedListButton 
                  username={search} 
                  label={buttonLabel}
                  loading={loadingButton}
                  disabled={loadingButton}
                  style={buttonStyle}/> 
              )}
              {listType === 'blacklist' && (
                <BlacklistButton
                  username={search} 
                  label={buttonLabel}
                  loading={loadingButton}
                  disabled={loadingButton}
                  style={buttonStyle}/> 
              )} 
              {listType === 'follow_blacklist' && (
                <FollowBlacklistsButton
                  username={search} 
                  label={buttonLabel}
                  loading={loadingButton}
                  disabled={loadingButton}
                  style={buttonStyle}/> 
              )} 
            </React.Fragment>}
          {searchLoading && 
          <CircularProgress
            style={buttonStyle}
            classes={{
              circle: classes.circle,
            }}
            size={30}
          />}
        </Col>)}
      </Row>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  searchListButton: state.interfaces.get('accountSearchListButton'),
  searchLoading: pending(state, 'CHECK_ACCOUNT_EXIST_REQUEST'),
  accountExist: state.profile.get('accountExist'),
  search: state.interfaces.get('accountSearchListKeyword'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setAccountListSearchkey,
    setAccountSearchListKeyword,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(SearchListsField)
