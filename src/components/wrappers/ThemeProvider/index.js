import React from 'react'
import { getSavedThemeRequest, generateStyles } from 'store/settings/actions'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const ThemeProvider = (props) => {
  const {
    children,
    themeStyles,
  } = props

  const useStyles = createUseStyles(themeStyles)
  const classes = useStyles()

  return (
    <React.Fragment>
      <div className={classes.bgColor}>
        {children}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  themeStyles: state.settings.get('themeStyles'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSavedThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeProvider)
