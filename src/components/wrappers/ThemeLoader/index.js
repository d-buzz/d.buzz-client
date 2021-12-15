import React, { useState, useEffect } from 'react'
import { getSavedThemeRequest, generateStyles } from 'store/settings/actions'
import { getTheme } from 'services/theme'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ThemeProvider } from 'components'

const ThemeLoader = (props) => {
  const {
    children,
    // getSavedThemeRequest,
    generateStyles,
  } = props

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // getSavedThemeRequest()
    //   .then(({ mode }) => {
    //     const theme = getTheme(mode)
    //     document.body.style.backgroundColor = theme.background.primary
    //     generateStyles(theme)
    //     setLoaded(true)
    //   })
    const mode = JSON.parse(localStorage.getItem('customUserData'))?.settings?.theme
    const theme = getTheme(mode)
    document.body.style.backgroundColor = theme.background.primary
    generateStyles(theme)
    setLoaded(true)
    
    // eslint-disable-next-line
  }, [])

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
