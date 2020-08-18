import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { Avatar } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { pending } from 'redux-saga-thunk'
import { Link } from 'react-router-dom'
import { AvatarlistSkeleton } from 'components'

const useStyle = createUseStyles({
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
    cursor: 'pointer',
    '& label': {
      cusor: 'pointer',
    },
    '& a': {
      textDecoration: 'none !important',
    },
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e6ecf0',
    '& a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f5f8fa',
    },
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 50,
  },
  right: {
    height: 'max-content',
    width: '98%',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  username: {
    color: '#657786',
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  post: {
    color: '#14171a',
    paddingTop: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
    cursor: 'pointer',
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  preview: {
    '& a': {
      borderRadius: '10px 10px',
      boxShadow: 'none',
    }
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
})

const SearchPeople = (props) => {
  const classes = useStyle()
  const { items, loading } = props

  return (
    <React.Fragment>
      {(items.people || []).map((item) => (
          <div className={classes.wrapper}>
            <div className={classes.row}>
              <Link to={`/@${item.account}`}>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <div className={classes.left}>
                      <Avatar author={item.account} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <p className={classes.name}>
                          @{item.account}
                        </p>
                        <p className={classes.username}>
                          <Chip  size="small" label={item.repscore} />
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Link>
            </div>
          </div>
        ))}
        <AvatarlistSkeleton loading={loading} />
        {(!loading && (items.people || []).length === 0) &&
          (<center><br/><h6>No people found with that username</h6></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('search'),
  loading: pending(state, 'SEARCH_REQUEST'),
})

export default connect(mapStateToProps)(SearchPeople)
