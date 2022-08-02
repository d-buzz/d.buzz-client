import React, { useState, useEffect } from 'react'
import { getSavedThemeRequest, generateStyles } from 'store/settings/actions'
import { getTheme } from 'services/theme'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ThemeProvider } from 'components'
import { getTheme as getUserTheme } from 'services/helper'

const ThemeLoader = (props) => {
  const {
    children,
    // getSavedThemeRequest,
    generateStyles,
  } = props

  const [loaded, setLoaded] = useState(false)
  const theme = getUserTheme()

  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem('customUserData'))?.settings?.theme
    const userTheme = getTheme(mode)
    document.body.style.backgroundColor = userTheme.background.primary
    
    generateStyles(getTheme(theme))
    setLoaded(true)
    
    // eslint-disable-next-line
  }, [theme])

  return (
    <React.Fragment>
      {loaded && (
        <ThemeProvider>
          {children}
        </ThemeProvider>
      )}
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSavedThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(ThemeLoader)
