import React, { useEffect } from 'react'
import { getSavedThemeRequest } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const ThemeProvider = (props) => {
  const { children, getSavedThemeRequest } = props

  useEffect(() => {
    getSavedThemeRequest()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div>
        {children}
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSavedThemeRequest,
  }, dispatch),
})


export default connect(null, mapDispatchToProps)(ThemeProvider)
