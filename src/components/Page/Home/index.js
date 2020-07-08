import React, { useEffect } from 'react'
import { testRequest } from 'store/tests/actions'
import compose from 'recompose/compose'
import { bindActionCreators } from 'redux'
import { connect} from 'react-redux'

const Home = (props) => {
  const { testRequest, data } = props
  
  useEffect(() => {
    testRequest()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <center>
        <h2>{ JSON.stringify(data) }</h2>
      </center>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  data: state.tests.get('data'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    testRequest,
  }, dispatch)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Home)