import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider as Provider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'

const ThemeProvider = (props) => {
  const {
    children,
    theme,
  } = props


  return (
    <React.Fragment>
      <Provider theme={theme}>
        <SkeletonTheme color={theme.skeleton.color} highlightColor={theme.skeleton.highlight}>
          {children}
        </SkeletonTheme>
      </Provider>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('themeStyles'),
})

export default connect(mapStateToProps)(ThemeProvider)
