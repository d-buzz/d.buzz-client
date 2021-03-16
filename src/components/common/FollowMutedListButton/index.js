import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openFollowMutedDialog, setAccountSearchListKeyword } from 'store/interface/actions'
import { setAccountFollowedMutedList, setAccountListSearchkey } from "store/profile/actions"

const FollowMutedListButton = (props) => {
  const { 
    loading=false,
    disabled=false,
    label, 
    username, 
    openFollowMutedDialog,
    setAccountFollowedMutedList,
    followedMuted,
    style,
    successCallback=null,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
  } = props

  const { pathname } = useLocation()
  const mutedListRoute = (pathname.match(/\/lists\/muted\/followed/g))

  const followMutedList = () => {
    openFollowMutedDialog(username, followMutedSuccessCallback)
  }

  const followMutedSuccessCallback = () => {
    if(successCallback){
      successCallback()
    }else{
      if(mutedListRoute){
        const oldList = [...followedMuted]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1) 
          setAccountFollowedMutedList(oldList)
        }else{
          const newData = {
            blacklist_description: "",
            muted_list_description: "",
            name: username,
          }
          const newList = [newData, ...oldList]
          setAccountFollowedMutedList(newList)
        }
        setAccountSearchListKeyword('')
        setAccountListSearchkey('follow_muted','')
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
        onClick={followMutedList}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  followedMuted: state.profile.get('followedMuted'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openFollowMutedDialog,
    setAccountFollowedMutedList,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowMutedListButton)
