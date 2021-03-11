import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
  } = props

  const unmuteUser = () => {
    openMuteDialog(username, muteSuccessCallback)
  }

  const muteSuccessCallback = () => {
    const oldList = [...mutedList]
    const index = oldList.findIndex(item => item.name === username)
    if(index !== -1){
      oldList.splice(index,1)
      setAccountMutedList(oldList)
    }
  }

  return (
    <React.Fragment>
      <ContainedButton
        fontSize={14}
        loading={loading}
        disabled={loading || disabled}
        style={{ float: 'right', marginTop: 5 }}
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
