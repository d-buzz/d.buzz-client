import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useHistory } from 'react-router-dom'
import {
  RoundedField,
  SearchIcon,
} from 'components/elements'

const useStyles = createUseStyles({
  search: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#e6ecf0',
  },
  searchTips: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    '& span': {
      color: '#d32f2f',
      fontWeight: 400,
    }
  }
})

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
  const [openTips, setOpenTips] = useState(false)
  const [search, setSearch] = useState()
  const classes = useStyles()
  const history = useHistory()
  const { disableTips = false, iconTop = -2 } = props

  const onMouseEnter = () => {
    setOpenTips(true)
  }

  const onMouseLeave = () => {
    setOpenTips(false)
  }

  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      history.replace(`/search?q=${search}`)
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
        icon={<SearchIcon top={iconTop} />}
        placeholder="Search D.Buzz"
        className={classes.search}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={handleSearchKey}
        value={search}
        onChange={onChange}
        {...props}
      />
      {!disableTips && (<SearchTips show={openTips || search} className={classes.searchTips} />)}
    </React.Fragment>
  )
}

export default SearchField
