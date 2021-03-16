import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openBlacklistDialog, setAccountSearchListKeyword } from 'store/interface/actions'
import { setAccountBlacklist, setAccountListSearchkey } from "store/profile/actions"

const BlacklistButton = (props) => {
  const { 
    loading=false,
    disabled=false,
    label, 
    username, 
    openBlacklistDialog,
    setAccountBlacklist,
    blacklistedList,
    style,
    successCallback=null,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
  } = props

  const { pathname } = useLocation()
  const blacklistRoute = (pathname.match(/\/lists\/blacklisted\/users/g))

  const blacklistUser = () => {
    openBlacklistDialog(username, blacklistSuccessCallback)
  }

  const blacklistSuccessCallback = () => {
    if(successCallback){
      successCallback()
    }else{
      if(blacklistRoute){
        const oldList = [...blacklistedList]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1) 
          setAccountBlacklist(oldList)
        }else{
          const newData = {
            blacklist_description: "",
            muted_list_description: "",
            name: username,
          }
          const newList = [newData, ...blacklistedList]
          setAccountBlacklist(newList)
        }
        setAccountSearchListKeyword('')
        setAccountListSearchkey('blacklist','')
      }
    }
  }

  return (
    <React.Fragment>
      <ContainedButton
        fontSize={14}
        loading={loading}
        disabled={loading || disabled}
        style={style}
        transparent={true}
        label={label}
        onClick={blacklistUser}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  blacklistedList: state.profile.get('blacklistedList'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openBlacklistDialog,
    setAccountBlacklist,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistButton)
