import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openMuteDialog } from 'store/interface/actions'
import { setAccountMutedList } from "store/profile/actions"

const MuteButton = (props) => {
  const { 
    loading,
    label, 
    username, 
    openMuteDialog,
    setAccountMutedList,
    mutedList,
    disabled=false,
    style,
    successCallback=null,
  } = props

  const { pathname } = useLocation()
  const mutedListRoute = (pathname.match(/\/lists\/muted\/users/g))

  const unmuteUser = () => {
    openMuteDialog(username, muteSuccessCallback)
  }

  const muteSuccessCallback = () => {
    if(successCallback){
      successCallback()
    }else{
      if(mutedListRoute){
        const oldList = [...mutedList]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1)
          setAccountMutedList(oldList)
        }
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
        onClick={unmuteUser}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  mutedList: state.profile.get('mutedList'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openMuteDialog,
    setAccountMutedList,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)
