import React from 'react'
import { connect } from 'react-redux'
import { PostList } from 'components'


const AccountPosts = (props) => {
  const { items } = props

  return (
    <React.Fragment>
      {
        items.map((item) => (
          <PostList
            active_votes={item.active_votes}
            author={item.author}
            permlink={item.permlink}
            created={item.created}
            body={item.body}
            upvotes={item.active_votes.length}
            replyCount={item.children}
            meta={JSON.parse(item.json_metadata)}
            payout={(item.pending_payout_value).replace('HBD', '')}
            profile={item.profile}
          />
        ))
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('profilePosts')
})

export default connect(mapStateToProps)(AccountPosts)
