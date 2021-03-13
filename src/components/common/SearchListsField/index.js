import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import {
  RoundedField,
  SearchIcon,
  ContainedButton,
} from 'components/elements'
import { connect } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { setAccountListSearchkey } from "store/profile/actions"

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
    dispatch,
    loadingButton=false,
    buttonLabel,
    listType,
    setAccountListSearchkey,
    ...otherProps
  } = props
  const [search, setSearch] = useState('')
  const classes = useStyles()

  useEffect(() => {
    setSearch(defaultValue)
  }, [defaultValue])

  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      setAccountListSearchkey(listType,search)
    }
  }

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    setSearch(value)
    setAccountListSearchkey(listType,value)
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
        {false && 
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

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setAccountListSearchkey,
  }, dispatch),
})


export default connect(null, mapDispatchToProps)(SearchListsField)
