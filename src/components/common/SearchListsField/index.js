import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useHistory } from 'react-router-dom'
import {
  RoundedField,
  SearchIcon,
  ContainedButton,
} from 'components/elements'
import { connect } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const useStyles = createUseStyles(theme => ({
  search: {
    margin: 10,
    ...theme.search.background,
  },
}))


const SearchListsField = (props) => {
  const { 
    iconTop = -2, 
    defaultValue,
    user,
    dispatch,
    showButton=false,
    loadingButton=false,
    buttonLabel,
    ...otherProps
  } = props
  const [search, setSearch] = useState('')
  const classes = useStyles()
  const history = useHistory()
  const { is_authenticated } = user

  useEffect(() => {
    setSearch(defaultValue)
  }, [defaultValue])

  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      let link = ''
      if(is_authenticated) {
        link = '/search'
      } else {
        link = '/ug/search'
      }
      link += `/posts?q=${encodeURIComponent(search)}`
      history.replace(link)
    }
  }

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    setSearch(value)
  }

  return (
    <React.Fragment>
      
      <Row>
        <Col>
          <RoundedField
            icon={<SearchIcon top={iconTop} />}
            placeholder='Search users'
            className={classes.search}
            onKeyDown={handleSearchKey}
            onChange={onChange}
            {...otherProps}
          /></Col>
        {showButton && 
        (<Col xs="auto">
          <ContainedButton
            fontSize={14}
            loading={loadingButton}
            disabled={loadingButton}
            style={{ float: 'right', marginTop: 13, marginRight: 10, marginLeft: -30 }}
            transparent={true}
            label={buttonLabel}
            className={classes.button}
          />
        </Col>)}
      </Row>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(SearchListsField)
