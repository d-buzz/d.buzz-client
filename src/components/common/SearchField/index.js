import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useHistory } from 'react-router-dom'
import {
  RoundedField,
} from 'components/elements'
import { isMobile } from 'react-device-detect'
import { connect } from 'react-redux'
import SearchBarIcon from 'components/elements/Icons/SearchBarIcon'

const useStyles = createUseStyles(theme => ({
  search: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 2,
    ...theme.search.background,
  },
  searchTips: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    color: theme.font.color,
    '& span': {
      color: '#d32f2f',
      fontWeight: 400,
    },
  },
}))

const SearchTips = ({ show, className }) => {
  return (
    <React.Fragment>
      {show && (
        <label className={className}>
          You can use <span>@username</span> or <span>#tags</span> to simplify your search
        </label>
      )}
    </React.Fragment>
  )
}

const SearchField = (props) => {
  const { disableTips = false, iconTop = -2, defaultValue, user, dispatch, ...otherProps } = props
  const [openTips, setOpenTips] = useState(false)
  const [search, setSearch] = useState('')
  const classes = useStyles()
  const history = useHistory()
  const { is_authenticated } = user

  useEffect(() => {
    setSearch(defaultValue)
  }, [defaultValue])

  const onMouseEnter = () => {
    setOpenTips(true)
  }

  const onMouseLeave = () => {
    setOpenTips(false)
  }

  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      let link = ''
      if(is_authenticated) {
        link = '/search'
      } else {
        link = '/ug/search'
      }

      if(search.startsWith('#')) {
        link += `/trending?q=${encodeURIComponent(search)}`
      } else if(search.startsWith('@')) {
        link += `/people?q=${encodeURIComponent(search)}`
      } else {
        link += `/trending?q=${encodeURIComponent(search)}`
      }

      history.push(link)
    }
  }

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    setSearch(value)
  }

  return (
    <React.Fragment>
      <RoundedField
        icon={<SearchBarIcon top={iconTop} />}
        placeholder={!isMobile ? 'Search D.Buzz': ''}
        className={classes.search}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={handleSearchKey}
        onChange={onChange}
        {...otherProps}
      />
      {!disableTips && (<SearchTips show={openTips || search} className={classes.searchTips} />)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(SearchField)
